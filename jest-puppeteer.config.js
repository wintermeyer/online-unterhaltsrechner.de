module.exports = {
  server: {
    command: 'npx serve',
    port: 3000,
    launchTimeout: 10000,
    debug: true
  },
  launch: {
    headless: 'new',
    slowMo: 50,
    args: ['--window-size=1920,1080']
  }
};
