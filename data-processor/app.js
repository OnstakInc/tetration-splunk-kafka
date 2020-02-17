const fs = require('fs');
const { Producer, ConsumerGroup, KafkaClient } = require('kafka-node');

const TETRATION_ALERTS = {
    KAFKA_BROKERS: 'kafka-2-strom.tetrationcloud.com:443,kafka-3-strom.tetrationcloud.com:443,kafka-1-strom.tetrationcloud.com:443',
    TOPIC: 'topic-5d12a3d6755f023a5e36b502',
    GROUP_ID: 'ConsumerGroup-5d12a3d6755f023a5e36b502',
    KAFKA_CA: './tetration-kafka/alerts/kafkaCA.cert',
    KAFKA_CERTIFICATE: './tetration-kafka/alerts/KafkaConsumerCA.cert',
    KAFKA_PRIVATE_KEY: './tetration-kafka/alerts/KafkaConsumerPrivateKey.key'
};

const SPLUNK_EVENTS = {
    KAFKA_BROKERS: 'ip-10-0-1-6.ec2.internal:9092',
    TOPIC: 'tetration-alerts'
};

function main() {

    console.log('INFO: Initializing Job Processor...');

    const consumerOptions = {
        kafkaHost: TETRATION_ALERTS.KAFKA_BROKERS,
        groupId: TETRATION_ALERTS.GROUP_ID,
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        fromOffset: 'latest',
        ssl: true,
        sslOptions: {
            rejectUnauthorized: false,
            ca: fs.readFileSync(TETRATION_ALERTS.KAFKA_CA, 'utf-8'),
            cert: fs.readFileSync(TETRATION_ALERTS.KAFKA_CERTIFICATE, 'utf-8'),
            key: fs.readFileSync(TETRATION_ALERTS.KAFKA_PRIVATE_KEY, 'utf-8')
        }
    };

    const producerOptions = {
        kafkaHost: SPLUNK_EVENTS.KAFKA_BROKERS
    };

    console.log('INFO: Establishing Broker Connections...');
    
    let kafkaClient = new KafkaClient(producerOptions);
    
    let kafkaProducer = new Producer(kafkaClient);

    let consumerGroup = new ConsumerGroup(consumerOptions, TETRATION_ALERTS.TOPIC);

    consumerGroup.on('message', async (message) => {
        try {
            console.log('INFO:', message.value);

            let payload = [
                {
                    topic: SPLUNK_EVENTS.TOPIC,
                    messages: message.value,
                    // partition: KAFKA_PARTITION,
                    // key: message.deviceId
                }
            ];
            
            kafkaProducer.send(payload, (err, data) => {
            
                if (err) {
                    console.log('ERROR:', err.message);
                    return;
                }
            
                console.log('INFO:', data);
            
            });

        } catch (err) {
            console.log('ERROR:', err.message);
        }
    });

    consumerGroup.on('error', (err) => {
        console.log('ERROR:', err.message);
    });

    kafkaProducer.on('error', (err) => {
        console.log('ERROR:', err.message);
    });

    console.log('INFO: All Brokers Initialized...');

}

main();