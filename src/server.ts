import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config'; 
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';

// uncaught exception
process.on('uncaughtException', error => {
  errorLogger.error('UnhandleException Detected', error);
  process.exit(1);
});

let server: any;
async function main() {
  try {
    if (!config.database_url) {
      console.error('Mongo URI is undefined. Please check your .env file.');
      process.exit(1); // Exit if URI is not defined
    }

    // Handle connection to MongoDB
    mongoose
      .connect(config.database_url as string)
      .then(() => {
        logger.info(colors.green('🚀 Database connected successfully'));

        // Seed Super Admin after database connection is successful
        // seedSuperAdmin();
      })
      .catch(error => {
        errorLogger.error(colors.red('🤢 Failed to connect Database'), error);
        process.exit(1); // Exit if database connection fails
      });

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);


      console.log(config.ip_address)

    // Start the server
    server = app.listen(port, config.ip_address as string, () => {
      logger.info(
        colors.yellow(
          `♻️  Application listening on   ${config.ip_address}:${config.port}`
        )
      );
    });

    // Socket.io configuration
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });

    socketHelper.socket(io);

    //@ts-ignore
    global.io = io;
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to initialize application'), error);
    process.exit(1);
  }

  // handle unhandledRejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandleRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM IS RECEIVE');
  if (server) {
    server.close();
  }
});
