#!/usr/bin/env node

/**
 * Test script to verify NestJS conversion
 * This script tests the converted NestJS endpoints
 */

const http = require("http");

const testEndpoints = [
  { method: "GET", path: "/", name: "Root endpoint" },
  { method: "GET", path: "/test", name: "Test endpoint" },
  { method: "GET", path: "/uplinks", name: "Get uplinks" },
  { method: "GET", path: "/devices", name: "Get devices" },
  { method: "GET", path: "/applications", name: "Get applications" },
  { method: "GET", path: "/uplinks/stats", name: "Get uplink stats" },
];

function testEndpoint(method, path, name) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 4000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(
          `✅ ${name}: ${res.statusCode} - ${data.substring(0, 100)}...`
        );
        resolve({ status: res.statusCode, data });
      });
    });

    req.on("error", (err) => {
      console.log(`❌ ${name}: Connection failed - ${err.message}`);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${name}: Timeout`);
      req.destroy();
      reject(new Error("Timeout"));
    });

    req.end();
  });
}

async function runTests() {
  console.log("🧪 Testing NestJS conversion...");
  console.log("Make sure the NestJS server is running on port 4000");
  console.log("");

  for (const endpoint of testEndpoints) {
    try {
      await testEndpoint(endpoint.method, endpoint.path, endpoint.name);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms between requests
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Failed`);
    }
  }

  console.log("");
  console.log("✅ Test completed!");
}

runTests().catch(console.error);
