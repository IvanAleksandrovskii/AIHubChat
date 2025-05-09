# core/logger.py

import logging
from pythonjsonlogger import jsonlogger

from core.config import settings


# Setup logging
def setup_logging() -> logging.Logger:
    """
    Set up logging configuration.

    :return: Configured logger
    """
    log_level = logging.DEBUG if settings.run.debug else logging.WARNING

    # Stream handler for console output
    stream_handler = logging.StreamHandler()
    stream_formatter = jsonlogger.JsonFormatter(
        fmt='%(asctime)s %(name)s %(levelname)s %(message)s %(filename)s:%(lineno)d',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    stream_handler.setFormatter(stream_formatter)

    new_logger = logging.getLogger("BACKEND")
    new_logger.setLevel(log_level)
    new_logger.addHandler(stream_handler)

    # Set log level for sqlalchemy
    logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
    if settings.run.debug:
        logging.getLogger('sqlalchemy.engine').setLevel(logging.DEBUG)

    return new_logger


# Initialize logger
log = setup_logging()
