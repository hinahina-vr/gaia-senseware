#pragma once

// HTTPS only. Replace after the Worker route/custom domain is provisioned.
#define API_BASE_URL "https://sensors.example.com/api/v1"

#define USE_MOCK_SENSOR true
#define TELEMETRY_INTERVAL_MS 10000UL
#define HTTP_TIMEOUT_MS 12000UL
#define RETRY_ATTEMPTS 3
