require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = parseInt(process.env.PORT || '3000', 10);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API docs available at http://localhost:${PORT}/api-docs`);
      console.log(`\n🌐 For Codespaces/dev containers, use the forwarded port URL`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

start();
