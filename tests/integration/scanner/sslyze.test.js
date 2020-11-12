const { scan } = require("../helpers");

test(
  "Sslyze scans the self-signed unsafe-https demo-app",
  async () => {
    const { categories, severities, count } = await scan(
      "sslyze-unsafe-https",
      "sslyze",
      ["--regular", "unsafe-https.demo-apps.svc"],
      90
    );

    expect(count).toBe(4);
    expect(categories).toMatchInlineSnapshot(`
      Object {
        "Invalid Certificate": 1,
        "Outdated TLS Version": 2,
        "TLS Service Info": 1,
      }
    `);
    expect(severities).toMatchInlineSnapshot(`
      Object {
        "informational": 1,
        "medium": 3,
      }
    `);
  },
  3 * 60 * 1000
);

test(
  "Invalid argument should be marked as errored",
  async () => {
    await expect(
      scan("sslyze-invalidArg", "sslyze", ["--invalidArg", "example.com"], 90)
    ).rejects.toThrow("HTTP request failed");
  },
  3 * 60 * 1000
);
