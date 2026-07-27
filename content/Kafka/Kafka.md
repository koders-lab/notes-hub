## Question: What happens if Kafka is down when your Command service tries to publish an event?

- **The Staff Answer:** \* **The Danger:** If the service finishes the DB transaction but fails to send the Kafka event, the system enters an inconsistent state.

  - **The Solution:** The **Transactional Outbox Pattern**. We save the `Order` AND the `Event` into the same database transaction. A separate process (like a polling thread or Debezium) then polls the `OUTBOX` table and pushes events to Kafka. If Kafka is down, the polling process just keeps retrying until success.
