'use strict';

exports.handler = async (event, context) => {
    console.log('event plain');
    console.log('==================');
    console.log(event);
    console.log('event json');
    console.log('==================');
    console.log(JSON.stringify(event, null, 2));
    console.log('context plain');
    console.log('==================');
    console.log(context);
    console.log('context json');
    console.log('==================');
    console.log(JSON.stringify(context, null, 2));
};
