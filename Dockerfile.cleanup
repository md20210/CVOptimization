FROM postgres:16-alpine

COPY cleanup-db.sh /cleanup-db.sh
RUN chmod +x /cleanup-db.sh

CMD ["/cleanup-db.sh"]
