/*
2023-10-30
HomeyScript by Fredrik Ahnell to Retrieve the Next Postal Delivery Date from PostNord API
Instructions: Send in your postal code as an argument from your flow or set it directly in your script for retrieve correct date from PostNord.
*/


// Define the postal code
let postalCode = 69231;
if (args[0]) postalCode = args[0];

// Your target URL
const url = `https://portal.postnord.com/api/sendoutarrival/closest?postalCode=${postalCode}`;

// Get the current date
const currentDate = new Date();

// Manually parse the date using regular expressions
function parseDeliveryDate(dateString) {
  const datePattern = /(\d{1,2}) (\w+), (\d{4})/;
  const match = dateString.match(datePattern);

  if (match) {
    const day = parseInt(match[1]);
    const month = match[2];
    const year = parseInt(match[3]);

    const months = {
      januari: 0,
      februari: 1,
      mars: 2,
      april: 3,
      maj: 4,
      juni: 5,
      juli: 6,
      augusti: 7,
      september: 8,
      oktober: 9,
      november: 10,
      december: 11
    };

    const monthIndex = months[month.toLowerCase()];
    if (monthIndex !== undefined) {
      return new Date(year, monthIndex, day);
    } else {
      console.error('Invalid month in date:', dateString);
      
    }
  } else {
    console.error('Invalid date format in the response');
    
  }
}

// Make an HTTP request using the fetch function
const response = await fetch(url, {
  method: 'GET'
})
  .then(response => response.json()) // Parse the response as JSON
  .then(data => {
    try {
      console.log('Received data from the URL:', data);

      if (data) {
        // Extract the delivery date and upcoming date
        const deliveryDate = parseDeliveryDate(data.delivery);
        const upcomingDate = parseDeliveryDate(data.upcoming);

        if (deliveryDate && upcomingDate) {
          // Calculate how many days until the next delivery
          const daysUntilNextDelivery = Math.ceil((deliveryDate - currentDate) / (1000 * 60 * 60 * 24));
          // Calculate how many days until the upcoming delivery
          const daysUntilUpcoming = Math.ceil((upcomingDate - currentDate) / (1000 * 60 * 60 * 24));
          

          // Display delivery dates and days until next delivery in the console
          console.log('Next delivery:', deliveryDate.toDateString());
          console.log('Todays date:', currentDate.toDateString());
          console.log('Upcoming delivery:', upcomingDate.toDateString());
          console.log('Days until next delivery:', daysUntilNextDelivery);
          console.log('Days until upcoming delivery:', daysUntilUpcoming);
          
          tag('postnord_DaysToDelivery', daysUntilNextDelivery);
          tag('postnord_DaysToUpcoming',daysUntilUpcoming);
          tag('postnord_Delivery',data.delivery);
          tag('postnord_Upcoming',data.upcoming);

          console.log('Returning value: ',daysUntilNextDelivery < 1);         
          return (daysUntilNextDelivery < 1);
                    
        } else {
          console.error('Invalid date format in the response');
        }
      } else {
        console.error('No data received from the URL');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  })
  .catch(error => {
    console.error('HTTP request error:', error);
  });

return(response);
