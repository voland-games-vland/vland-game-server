export default {
  port: parseInt(process.env.PORT || '', 10) || 3000,
  colyseus: {
    monitor: {
      auth: {
        username: process.env.COLYSEUS_MONITOR_AUTH_USERNAME || 'admin',
        password: process.env.COLYSEUS_MONITOR_AUTH_PASSWORD || 'admin'
      }
    }
  }
}