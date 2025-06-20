#!/usr/bin/env node

const { Redis } = require('@upstash/redis');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Vercel
  VERCEL_TOKEN: process.env.VERCEL_TOKEN,
  VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
  VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
  
  // Upstash Redis
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  
  // GitHub
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_REPO: 'robdon3/aegis-engine',
  
  // Monitoring intervals (in milliseconds) - OPTIMIZED FOR COST
  VERCEL_CHECK_INTERVAL: process.env.VERCEL_CHECK_INTERVAL || 30 * 60 * 1000, // 30 minutes (was 5 minutes)
  REDIS_CHECK_INTERVAL: process.env.REDIS_CHECK_INTERVAL || 15 * 60 * 1000,   // 15 minutes (was 2 minutes)
  GITHUB_CHECK_INTERVAL: process.env.GITHUB_CHECK_INTERVAL || 60 * 60 * 1000, // 60 minutes (was 10 minutes)
  
  // Log file
  LOG_FILE: path.join(__dirname, '../logs/monitoring.log')
};

// Ensure logs directory exists
const logsDir = path.dirname(CONFIG.LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logging utility
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(CONFIG.LOG_FILE, logMessage + '\n');
}

// Health check results storage
let healthStatus = {
  vercel: { status: 'unknown', lastCheck: null, details: {} },
  redis: { status: 'unknown', lastCheck: null, details: {} },
  github: { status: 'unknown', lastCheck: null, details: {} },
  lastUpdate: null
};

// HTTP request utility
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy());
    req.end();
  });
}

// Vercel Monitoring
async function checkVercelHealth() {
  try {
    if (!CONFIG.VERCEL_TOKEN || !CONFIG.VERCEL_PROJECT_ID) {
      log('Vercel monitoring disabled - missing environment variables', 'WARN');
      return;
    }

    const url = `https://api.vercel.com/v1/projects/${CONFIG.VERCEL_PROJECT_ID}/deployments?limit=5`;
    const options = {
      headers: {
        'Authorization': `Bearer ${CONFIG.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(url, options);
    
    if (response.status === 200) {
      const deployments = response.data.deployments || [];
      const latestDeployment = deployments[0];
      
      healthStatus.vercel = {
        status: latestDeployment?.readyState === 'READY' ? 'healthy' : 'warning',
        lastCheck: new Date(),
        details: {
          latestDeployment: latestDeployment?.readyState || 'unknown',
          totalDeployments: deployments.length,
          recentDeployments: deployments.slice(0, 3).map(d => ({
            id: d.uid,
            state: d.readyState,
            createdAt: d.createdAt
          }))
        }
      };
      
      log(`Vercel health check: ${healthStatus.vercel.status}`, 'INFO');
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    healthStatus.vercel = {
      status: 'error',
      lastCheck: new Date(),
      details: { error: error.message }
    };
    log(`Vercel health check failed: ${error.message}`, 'ERROR');
  }
}

// Upstash Redis Monitoring
async function checkRedisHealth() {
  try {
    if (!CONFIG.UPSTASH_REDIS_REST_URL || !CONFIG.UPSTASH_REDIS_REST_TOKEN) {
      log('Redis monitoring disabled - missing environment variables', 'WARN');
      return;
    }

    const redis = new Redis({
      url: CONFIG.UPSTASH_REDIS_REST_URL,
      token: CONFIG.UPSTASH_REDIS_REST_TOKEN,
    });

    // Simple PING test instead of SET/GET/DEL operations
    const pingResult = await redis.ping();
    
    if (pingResult === 'PONG') {
      healthStatus.redis = {
        status: 'healthy',
        lastCheck: new Date(),
        details: {
          connection: 'active',
          operations: 'working',
          ping: 'successful'
        }
      };
      
      log('Redis health check: healthy', 'INFO');
    } else {
      throw new Error('Redis ping test failed');
    }
  } catch (error) {
    healthStatus.redis = {
      status: 'error',
      lastCheck: new Date(),
      details: { error: error.message }
    };
    log(`Redis health check failed: ${error.message}`, 'ERROR');
  }
}

// GitHub Monitoring
async function checkGitHubHealth() {
  try {
    if (!CONFIG.GITHUB_TOKEN) {
      log('GitHub monitoring disabled - missing environment variables', 'WARN');
      return;
    }

    const url = `https://api.github.com/repos/${CONFIG.GITHUB_REPO}`;
    const options = {
      headers: {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'User-Agent': 'Project-Aegis-Monitor'
      }
    };

    const response = await makeRequest(url, options);
    
    if (response.status === 200) {
      const repo = response.data;
      
      // Get recent commits
      const commitsUrl = `https://api.github.com/repos/${CONFIG.GITHUB_REPO}/commits?per_page=5`;
      const commitsResponse = await makeRequest(commitsUrl, options);
      
      healthStatus.github = {
        status: 'healthy',
        lastCheck: new Date(),
        details: {
          repository: repo.name,
          visibility: repo.private ? 'private' : 'public',
          lastCommit: commitsResponse.status === 200 && commitsResponse.data[0] 
            ? commitsResponse.data[0].commit.message.substring(0, 50) + '...'
            : 'unknown',
          stars: repo.stargazers_count,
          forks: repo.forks_count
        }
      };
      
      log('GitHub health check: healthy', 'INFO');
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    healthStatus.github = {
      status: 'error',
      lastCheck: new Date(),
      details: { error: error.message }
    };
    log(`GitHub health check failed: ${error.message}`, 'ERROR');
  }
}

// Generate health report
function generateHealthReport() {
  const report = {
    timestamp: new Date().toISOString(),
    overall: 'healthy',
    services: healthStatus,
    summary: {
      healthy: 0,
      warning: 0,
      error: 0,
      unknown: 0
    }
  };

  // Count statuses
  Object.values(healthStatus).forEach(service => {
    if (service.status === 'healthy') report.summary.healthy++;
    else if (service.status === 'warning') report.summary.warning++;
    else if (service.status === 'error') report.summary.error++;
    else report.summary.unknown++;
  });

  // Determine overall status
  if (report.summary.error > 0) report.overall = 'error';
  else if (report.summary.warning > 0) report.overall = 'warning';
  else if (report.summary.healthy > 0) report.overall = 'healthy';
  else report.overall = 'unknown';

  return report;
}

// Save health report
function saveHealthReport(report) {
  const reportFile = path.join(__dirname, '../logs/health-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Main monitoring loop
async function runMonitoring() {
  log('Starting Project Aegis monitoring system...', 'INFO');
  
  // Initial health checks
  await Promise.all([
    checkVercelHealth(),
    checkRedisHealth(),
    checkGitHubHealth()
  ]);

  // Set up intervals
  setInterval(checkVercelHealth, CONFIG.VERCEL_CHECK_INTERVAL);
  setInterval(checkRedisHealth, CONFIG.REDIS_CHECK_INTERVAL);
  setInterval(checkGitHubHealth, CONFIG.GITHUB_CHECK_INTERVAL);

  // Generate and save reports every 30 minutes (was 5 minutes)
  setInterval(() => {
    const report = generateHealthReport();
    saveHealthReport(report);
    log(`Health report generated: ${report.overall}`, 'INFO');
  }, 30 * 60 * 1000);

  log('Monitoring system started successfully', 'INFO');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Shutting down monitoring system...', 'INFO');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Shutting down monitoring system...', 'INFO');
  process.exit(0);
});

// Start monitoring
runMonitoring().catch(error => {
  log(`Failed to start monitoring: ${error.message}`, 'ERROR');
  process.exit(1);
});
