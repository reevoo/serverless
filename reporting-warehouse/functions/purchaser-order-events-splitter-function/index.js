'use strict';

const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
  event.Records.forEach((record) => {
    console.log('Received record: ', record);
    const fatPurchaserOrderEvent = new Buffer(record.kinesis.data, 'base64').toString('ascii');
    console.log('Decoded event data:', fatPurchaserOrderEvent);
    const jsonPayload = JSON.parse(fatPurchaserOrderEvent);
    extractAndPublishPurchaserOrderEntityEvent(jsonPayload);
    extractAndPublishPurchaserLineItemsEntityEvents(jsonPayload);
    extractAndPublishPurchaserEvent(jsonPayload);
  });
  callback(null, 'Successfully processed ${event.Records.length} records.');
};


function extractAndPublishPurchaserOrderEntityEvent(jsonData) {
  const purchaserOrderEntity = {
    message_offset: jsonData.meta.message_offset,
    message_created_at: jsonData.meta.message_created_at,
    message_operation: jsonData.meta.message_operation,
    message_backtrace: jsonData.meta.message_backtrace,
    uuid: jsonData.payload.uuid,
    created_at: jsonData.payload.created_at,
    purchaser_uuid: jsonData.payload.purchaser.uuid,
    organisation_uuid: jsonData.payload.organisation.uuid,
    processed_purchaser_feed_uuid: jsonData.payload.purchaser_feed.uuid
  };
  putRecord(purchaserOrderEntity, 'PurchaserOrderLandingStream');
}

function extractAndPublishPurchaserLineItemsEntityEvents(jsonData) {
  const purchaser_line_items = jsonData.payload.purchaser_line_items;
  purchaser_line_items.forEach((pli,index) => {
    const purchaserLineItem = {
      message_offset: jsonData.meta.message_offset,
      message_created_at: jsonData.meta.message_created_at,
      message_operation: jsonData.meta.message_operation,
      message_backtrace: jsonData.meta.message_backtrace,
      uuid: pli.uuid,
      created_at: jsonData.payload.created_at,
      product_uuid: pli.product.uuid,
      purchaser_order_uuid: jsonData.payload.uuid
    };
    putRecord(purchaserLineItem, 'PurchaserLineItemLandingStream');
  });
}

function extractAndPublishPurchaserEvent(jsonData) {
  const purchaserOrderEntity = {
    message_offset: jsonData.meta.message_offset,
    message_created_at: jsonData.meta.message_created_at,
    message_operation: jsonData.meta.message_operation,
    message_backtrace: jsonData.meta.message_backtrace,
    uuid: jsonData.payload.purchaser.uuid,
    created_at: jsonData.payload.created_at,
    is_unsubscribed: false,
    country_name: jsonData.payload.purchaser.country_code,
    partial_postcode: 'SW1'
  };
  putRecord(purchaserOrderEntity, 'PurchaserLandingStream');
}

function putRecord(jsonPayload, streamName) {
  var params = {
    Data: JSON.stringify(jsonPayload),
    PartitionKey: 'MyPartitionKey',
    StreamName: streamName
  };
  kinesis.putRecord(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log("SUCCESS: " + data); // successful response
  });
}