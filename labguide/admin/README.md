# Cisco Tetration - Splunk - Kafka - Integration Guide
  
## Administrative Guide


### Table of Contents

#### Diagrams
<a href="#diagram-001" style="font-weight:bold">Diagram 001</a>  

#### Section 1 - Splunk Installation on CentOS 7
<a href="#section-01--step-001" style="font-weight:bold">Step 001 - Login to VM</a>  
<a href="#section-01--step-002" style="font-weight:bold">Step 002 - Donwload Splunk</a>  
<a href="#section-01--step-003" style="font-weight:bold">Step 003 - Install Splunk</a>  
<a href="#section-01--step-004" style="font-weight:bold">Step 004 - Create Admin Credentials</a>  
<a href="#section-01--step-005" style="font-weight:bold">Step 005 - Start Splunk</a>  
<a href="#section-01--step-006" style="font-weight:bold">Step 006 - Connect in Browser</a>  

#### Section 2 - Splunk Connect for Kafka Installation
<a href="#section-02--step-001" style="font-weight:bold">Step 001 - Open Splunk WebUI</a>  
<a href="#section-02--step-002" style="font-weight:bold">Step 002 - Navigate to Data Inputs</a>  
<a href="#section-02--step-003" style="font-weight:bold">Step 003 - Navigate to HTTP Collector</a>  
<a href="#section-02--step-004" style="font-weight:bold">Step 004 - Navigate to Global Settings</a>  
<a href="#section-02--step-005" style="font-weight:bold">Step 005 - Enable All Tokens</a>  
<a href="#section-02--step-006" style="font-weight:bold">Step 006 - Create a New Token</a>  
<a href="#section-02--step-007" style="font-weight:bold">Step 007 - Enable Indexer</a>  
<a href="#section-02--step-008" style="font-weight:bold">Step 008 - Create a New Index</a>  
<a href="#section-02--step-009" style="font-weight:bold">Step 009 - Name and Save Index</a>  
<a href="#section-02--step-010" style="font-weight:bold">Step 010 - Review New Index</a>  
<a href="#section-02--step-011" style="font-weight:bold">Step 011 - Submit Token</a>  
<a href="#section-02--step-012" style="font-weight:bold">Step 012 - Copy Token</a>  

#### Section 3 - Connector Installation and Configuration 
<a href="#section-03--step-001" style="font-weight:bold">Step 001 - Download Splunk Kafka Connect</a>  
<a href="#section-03--step-002" style="font-weight:bold">Step 002 - Create Directory</a>  
<a href="#section-03--step-003" style="font-weight:bold">Step 003 - Modify Properties</a>  
<a href="#section-03--step-004" style="font-weight:bold">Step 004 - Deploy</a>  
<a href="#section-03--step-005" style="font-weight:bold">Step 005 - Verify</a>  
<a href="#section-03--step-006" style="font-weight:bold">Step 006 - Initiate Connector</a>  
<a href="#section-03--step-007" style="font-weight:bold">Information on ReST API</a>  

---

#### Live Interactive Diagram
<div class="diagram" id="diagram-001"><a href="#diagram-001" style="font-weight:bold">Diagram 001</a></div>  
You may prefer to utilize [this interactive LucidChart diagram](https://www.lucidchart.com/documents/view/6aaec326-e9c5-43bb-a665-5e7b29c7e5a2){:target="_blank"}. It is possible that the interactive diagram may have slightly newer enhancements or modifications, depending on when you view, and should be considered to be the most reliable and up-to-date version, though every attempt will be made to take static screenshots and update those here, as often as possible. 

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/diagrams_001.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/diagrams_001.png" style="width:100%;height:100%;"></a>  


---
#### Section 1 - Splunk Installation on CentOS 7
<div class="step" id="section-01--step-001"><a href="#section-01--step-001" style="font-weight:bold">Step 001</a></div>  
Login with credentials of your machine and then become root user with the following commands:
`sudo su -`

<div class="step" id="section-01--step-002"><a href="#section-01--step-002" style="font-weight:bold">Step 002</a></div>  

Create your account on Splunk.com and download your Splunk package. In this case, we used the following commands:
```
wget -O splunk-8.0.1-6db836e2fb9e-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=8.0.1&product=splunk&filename=splunk-8.0.1-6db836e2fb9e-linux-2.6-x86_64.rpm&wget=true'
```

<div class="step" id="section-01--step-003"><a href="#section-01--step-003" style="font-weight:bold">Step 003</a></div>  

Install Splunk:

`rpm -i (Splunk-version-rpm-package)`

In our case,  
`rpm -i splunk-8.0.1-6db836e2fb9e-linux-2.6-x86_64.rpm`

<div class="step" id="section-01--step-004"><a href="#section-01--step-004" style="font-weight:bold">Step 004</a></div>  

After installation is complete, you must create the admin credentials manually without starting Splunk. To do this, open the user.conf file with your favourite editor. Here we show vi being used.  

`vi/opt/splunk/etc/system/local/user-seed.conf`  

Add the following lines in the file, save, and exit.  

```
[user_info]
USERNAME = admin 
PASSWORD = your password
```   


<div class="step" id="section-01--step-005"><a href="#section-01--step-005" style="font-weight:bold">Step 005</a></div>  

Start your instance of Splunk with following command:  

`/opt/splunk/bin/splunk start`

<div class="step" id="section-01--step-006"><a href="#section-01--step-006" style="font-weight:bold">Step 006</a></div>  

From your web browser, open Splunk Enterprise Web Console
`http://your_public_ip:8000`

Enter your credentials and explore Splunk.

Your Splunk machine is now ready to go. 

---
#### Section 2 - Splunk Connect for Kafka Installation

###### System Requirements
> A Kafka Connect Environment running Kafka version 1.0.0 or later.
>   Java 8 or later.
>   Splunk platform environment of version 6.5 or later.
>   Configured and Valid HTTP Event Collector (HEC) token. 

<div class="step" id="section-02--step-001"><a href="#section-02--step-001" style="font-weight:bold">Step 001</a></div>  

Start creating HEC token by following the instructions provided below with images.
From any browser visit `http://your_public_ip:8000` and provide your credentials to login.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-001.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-001.png" style="width:100%;height:100%;"></a>  
  

<div class="step" id="section-02--step-002"><a href="#section-02--step-002" style="font-weight:bold">Step 002</a></div>  

After login, click Settings, then click Data inputs as shown in the image below.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-002.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-002.png" style="width:100%;height:100%;"></a>  

<div class="step" id="section-02--step-003"><a href="#section-02--step-003" style="font-weight:bold">Step 003</a></div>  

Next, click on HTTP Event Collector. 

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-003.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-003.png" style="width:100%;height:100%;"></a>  

<div class="step" id="section-02--step-004"><a href="#section-02--step-004" style="font-weight:bold">Step 004</a></div>  

Before start creating a New Token click Global Setting.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-004.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-004.png" style="width:100%;height:100%;"></a>  
  
<div class="step" id="section-02--step-005"><a href="#section-02--step-005" style="font-weight:bold">Step 005</a></div>  

Here you will select Enabled for All Tokens and verify the port is set to 8088. Click Save. 

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-005.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-005.png" style="width:100%;height:100%;"></a>  

<div class="step" id="section-02--step-006"><a href="#section-02--step-006" style="font-weight:bold">Step 006</a></div>  

Now we will create our New Token by clicking it.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-006.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-006.png" style="width:100%;height:100%;"></a>  
  
<div class="step" id="section-02--step-007"><a href="#section-02--step-007" style="font-weight:bold">Step 007</a></div>  

Give your token any Name and according to your need you can enable or disable Indexer acknowledgement and then click Next.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-007.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-007.png" style="width:100%;height:100%;"></a>  


<div class="step" id="section-02--step-008"><a href="#section-02--step-008" style="font-weight:bold">Step 008</a></div>  

Next, click Create a new index.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-008.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-008.png" style="width:100%;height:100%;"></a>  
  
 
<div class="step" id="section-02--step-009"><a href="#section-02--step-009" style="font-weight:bold">Step 009</a></div>  

Simple add a Name for your index and click Save. You can leave other options as default.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-009.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-009.png" style="width:100%;height:100%;"></a>  
  

<div class="step" id="section-02--step-010"><a href="#section-02--step-010" style="font-weight:bold">Step 010</a></div>  

Select your created index and make sure it appears in Selected item(s) box and click Review.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-010.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-010.png" style="width:100%;height:100%;"></a>  
 

<div class="step" id="section-02--step-011"><a href="#section-02--step-011" style="font-weight:bold">Step 011</a></div>  

Review your setting and click Submit to create your token.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-011.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-011.png" style="width:100%;height:100%;"></a>  
  

<div class="step" id="section-02--step-012"><a href="#section-02--step-012" style="font-weight:bold">Step 012</a></div>  

Here your token is created you can copy your Token Value and can use in your Rest Api. You should now be able to begin searching .

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-012.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_2-012.png" style="width:100%;height:100%;"></a>  

---
#### Section 3 - Connector Installation and Configuration
<div class="step" id="section-03--step-001"><a href="#section-03--step-001" style="font-weight:bold">Step 001</a></div>  

Visit https://github.com/splunk/kafka-connect-splunk/releases and download the latest `splunk-kafka-connect-[version].jar` release.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_3-001.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_3-001.png" style="width:100%;height:100%;"></a>  
  
<div class="step" id="section-03--step-002"><a href="#section-03--step-002" style="font-weight:bold">Step 002</a></div>  
  
Create a directory to store your Kafka Connect Connector. This will be used for your `plugin.path` setting.

<a href="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_3-002.png"><img src="https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/images/admin_3-002.png" style="width:100%;height:100%;"></a>  


<div class="step" id="section-03--step-003"><a href="#section-03--step-003" style="font-weight:bold">Step 003</a></div>  

Navigate to your `/$KAFKA_HOME/config/` directory.  

Modify the `connect-distributed.properties` file to include the below information.  

```
#These settings may already be configured if you have deployed a connector in your Kafka Connect Environment
bootstrap.servers=<BOOTSTRAP_SERVERS>(ip-10-0-1-6.ec2.internal:9092)
plugin.path=<PLUGIN_PATH>(/opt/kafka/kafka-connector)
#Required
key.converter=org.apache.kafka.connect.storage.StringConverter
value.converter=org.apache.kafka.connect.storage.StringConverter
key.converter.schemas.enable=false
value.converter.schemas.enable=false
internal.key.converter=org.apache.kafka.connect.json.JsonConverter
internal.value.converter=org.apache.kafka.connect.json.JsonConverter
internal.key.converter.schemas.enable=false
internal.value.converter.schemas.enable=false
offset.flush.interval.ms=10000
#Recommended
group.id=kafka-connect-splunk-hec-sink

bootstrap.servers ## This is a comma-separated list of where your Kafka brokers are located.
plugin.path       ## To make the JAR visible to Kafka Connect, we need to ensure that when Kafka 	Connect is started that the plugin path variable is folder path location of where your connector 	was installed to in the earlier section. 
```

<div class="step" id="section-03--step-004"><a href="#section-03--step-004" style="font-weight:bold">Step 004</a></div>  

After we have our properties file configured and ready to go, we're now ready to deploy Kafka Connect. If we kept the same name for our properties file, this command will deploy Kafka Connect.  

`./bin/connect-distributed.sh config/connect-distributed.properties`


<div class="step" id="section-03--step-005"><a href="#section-03--step-005" style="font-weight:bold">Step 005</a></div>  

Now is a good time to check that the Splunk Connect for Kafka has been installed correctly and is ready to be deployed. Run the following command and note the results.  

`curl http://KAFKA_CONNECT_HOST:8083/connector-plugins`


<div class="step" id="section-03--step-006"><a href="#section-03--step-006" style="font-weight:bold">Step 006</a></div>  

Initiate Connector for Splunk Indexing with Acknowledgement Using HEC/Event Endpoints:

```
Rest API:

curl -s 10.0.1.6:8083/connectors -X POST -H “Content-Type:application/json”  -d’{
“name”: “Sending-Data”, 
“config”: { 
“connector.class”: “com.splunk.kafka.connect.SplunkSinkConnector”,
“task.max”: “1”,
“topics”: “test”,
“splunk.indexes”: “test”,
“splunk.sourcetypes”: “access_combined”,
“splunk.hec.uri”: “http://54.224.99.155:8088”,
“splunk.hec.token”: “c8926f55-2c9b-4e16-88a7-eba0a039998b”,
“splunk.hec.ack.enabled”: “false”,
“splunk.hec.raw”: “true”,
“splunk.hec.raw.line.breaker”: “####”,
“splunk.hec.ssl.validate.certs”: “false”
	}
}’
```

<div class="step" id="section-03--step-007"><a href="#section-03--step-007" style="font-weight:bold">Information on ReST API</a></div>  

Following is the information about the REST API.  

i.	name: Connector name. A consumer group with this name will be created with tasks to be distributed evenly across the connector cluster nodes.  

ii.	connector.class: The Java class used to perform connector jobs. Keep the default unless you modify the connector.  

iii.	tasks.max: The number of tasks generated to handle data collection jobs in parallel. The tasks will be spread evenly across all Splunk Kafka Connector nodes.  

iv.	topics: Comma separated list of Kafka topics for Splunk to consume.  

v.	splunk.hec.uri: Splunk HEC URIs. Either a comma separated list of the FQDNs or IPs of all Splunk indexers, or a load balancer. If using the former, the connector will load balance to indexers using round robin
vi.	splunk.hec.token: Splunk HTTP Event Collector token.  

vii.	splunk.hec.ack.enabled: Valid settings are true or false. When set to true the Splunk Kafka Connector will poll event ACKs for POST events before check-pointing the Kafka offsets. This is used to prevent data loss, as this setting implements guaranteed delivery.  

viii.	splunk.hec.raw: Set to true in order for Splunk software to ingest data using the the /raw HEC endpoint. false will use the /event endpoint.  

ix.	splunk.hec.json.event.enrichment: Only applicable to /event HEC endpoint. This setting is used to enrich raw data with extra metadata fields. It contains a comma separated list of key value pairs. The configured enrichment metadata will be indexed along with raw event data by Splunk software. Note: Data enrichment for /event HEC endpoint is only available in Splunk Enterprise 6.5 and above.  

x.	splunk.hec.track.data: Valid settings are true or false. When set to true, data loss and data injection latency metadata will be indexed along with raw data


---

 

  
| [Return to Table of Contents](https://onstakinc.github.io/tetration-splunk-kafka/labguide/) | [Go to Top of the Page](https://onstakinc.github.io/tetration-splunk-kafka/labguide/admin/) | 