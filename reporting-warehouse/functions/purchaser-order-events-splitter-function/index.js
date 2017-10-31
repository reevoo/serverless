const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis({region: 'us-east-1'});

export const handler = (event, context, callback) => {
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
    message_uuid: jsonData.meta.message_uuid,
    message_created_at: jsonData.meta.message_created_at,
    message_operation: jsonData.meta.message_operation,
    message_backtrace: jsonData.meta.message_backtrace,
    entity_uuid: jsonData.payload.uuid,
    created_at: jsonData.payload.created_at,
    order_reference: jsonData.payload.order_reference,
    purchaser_reference: jsonData.payload.purchaser_reference,
    purchaser_uuid: jsonData.payload.purchaser.uuid,
    organisation_uuid: jsonData.payload.organisation.uuid,
    processed_purchaser_feed_uuid: jsonData.payload.purchaser_feed.uuid
  };
  putRecord(purchaserOrderEntity, 'PurchaserOrderLandingStream');
}

function extractAndPublishPurchaserLineItemsEntityEvents(jsonData) {
  const purchaser_line_items = jsonData.payload.purchaser_line_items;
  purchaser_line_items.forEach((pli) => {
    const purchaserLineItem = {
      message_uuid: jsonData.meta.message_uuid,
      message_created_at: jsonData.meta.message_created_at,
      message_operation: jsonData.meta.message_operation,
      message_backtrace: jsonData.meta.message_backtrace,
      entity_uuid: pli.uuid,
      created_at: pli.created_at,
      product_uuid: pli.product.uuid,
      purchaser_order_uuid: jsonData.payload.uuid,
      metadata: pli.metadata
    };
    putRecord(purchaserLineItem, 'PurchaserLineItemLandingStream');
  });
}

function extractAndPublishPurchaserEvent(jsonData) {
  const purchaserOrderEntity = {
    message_uuid: jsonData.meta.message_uuid,
    message_created_at: jsonData.meta.message_created_at,
    message_operation: jsonData.meta.message_operation,
    message_backtrace: jsonData.meta.message_backtrace,
    entity_uuid: jsonData.payload.purchaser.uuid,
    created_at: jsonData.payload.purchaser.created_at,
    updated_at: jsonData.payload.purchaser.updated_at,
    is_unsubscribed: jsonData.payload.purchaser.is_unsubscribed,
    country_name: jsonData.payload.purchaser.country_name,
    partial_postcode: jsonData.payload.purchaser.partial_postcode
  };
  putRecord(purchaserOrderEntity, 'PurchaserLandingStream');
}

function putRecord(jsonPayload, streamName) {
  const params = {
    Data: JSON.stringify(jsonPayload),
    PartitionKey: 'MyPartitionKey',
    StreamName: streamName
  };
  kinesis.putRecord(params, function(err) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log("SUCCESSsss"); // successful response
  });
}