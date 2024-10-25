/*
2024-10-25
Updated script to new API version 3

2023-10-30
HomeyScript by Fredrik Ahnell to Retrieve the Next Postal Delivery Date from PostNord API
Instructions: Send in your postal code as an argument from your flow or set it directly in your script to retrieve the correct date from PostNord.
*/

// Define the postal code
let postalCode = 69231;
if (args[0]) postalCode = args[0];

// Your target URL
const url = `https://portal.postnord.com/api/sendoutarrival/closest?postalCode=${postalCode}`;

// Get the current date
const currentDate = new Date();

// Function to parse delivery dates
function parseDeliveryDate(dateString) {
  const datePattern = /(\d{1,2}) (\w+), (\d{4})/;
  const match = dateString.match(datePattern);

  if (match) {
    const day = parseInt(match[1]);
    const month = match[2].toLowerCase();
    const year = parseInt(match[3]);

    const months = {
      januari: 0, februari: 1, mars: 2, april: 3, maj: 4, juni: 5,
      juli: 6, augusti: 7, september: 8, oktober: 9, november: 10, december: 11
    };

    return months[month] !== undefined ? new Date(year, months[month], day) : null;
  } else {
    console.error('Invalid date format in response:', dateString);
    return null;
  }
}

// Make an HTTP request using fetch
const response = await fetch(url, { method: 'GET' })
  .then(response => response.json())
  .then(data => {
    console.log('Data received from URL:', data);

    if (data) {
      const deliveryDate = parseDeliveryDate(data.delivery);
      const upcomingDate = parseDeliveryDate(data.upcoming);

      if (deliveryDate && upcomingDate) {
        const daysUntilNextDelivery = Math.ceil((deliveryDate - currentDate) / (1000 * 60 * 60 * 24));
        const daysUntilUpcoming = Math.ceil((upcomingDate - currentDate) / (1000 * 60 * 60 * 24));

        console.log('Next delivery:', deliveryDate.toDateString());
        console.log('Today’s date:', currentDate.toDateString());
        console.log('Upcoming delivery:', upcomingDate.toDateString());
        console.log('Days until next delivery:', daysUntilNextDelivery);
        console.log('Days until upcoming delivery:', daysUntilUpcoming);

        tag('postnord_DaysToDelivery', daysUntilNextDelivery);
        tag('postnord_DaysToUpcoming', daysUntilUpcoming);
        tag('postnord_Delivery', data.delivery);
        tag('postnord_Upcoming', data.upcoming);

        console.log('Returning value:', daysUntilNextDelivery < 1);
        return daysUntilNextDelivery < 1;
      } else {
        console.error('Invalid date format in response');
      }
    } else {
      console.error('No data received from URL');
    }
  })
  .catch(error => {
    console.error('HTTP request error:', error);
  });

return response;
