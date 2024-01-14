HomeyScript: PostNord Mail Delivery Checker

Description

This HomeyScript interacts with the PostNord API to determine if mail will be delivered to your specified postal code on a given day. It is designed to integrate seamlessly into your Homey workflow, providing real-time information about mail delivery status.

Functionality

The script performs a check with the PostNord API and returns a boolean value (TRUE or FALSE) indicating whether there is mail delivery scheduled for your postal code that day. Additionally, it generates four tags with detailed delivery information.

Output Tags

The script provides the following tags as part of its output:

postnord_DaysToDelivery: The number of days remaining until the next delivery. If delivery is scheduled for the same day, it returns 0.
postnord_DaysToUpcoming: The number of days until the subsequent delivery following the next one.
postnord_Delivery: The date of the next scheduled delivery.
postnord_Upcoming: The date of the delivery following the next one.

![image](https://github.com/FreddHomey/PostNord-Utdelning/assets/151749265/c5dd967e-3d1e-48ac-9fed-9e37f8d60260)


Instructions for Use

Integration into Flows: Integrate this script into your Homey flows using an "and logic with argument" condition. This setup enables the script to return TRUE or FALSE, based on whether mail delivery is scheduled for that day.

Flow Example: In a practical application, you might set up a flow that triggers this script every weekday. Depending on the script's return value, you can create a custom message that gets pushed as a notification to your phone.
For instance, if the script returns TRUE, indicating mail delivery for the day, you can receive a notification with the expected delivery date and other relevant details.
![image](https://github.com/FreddHomey/PostNord-Utdelning/assets/151749265/a76671a6-032c-4f34-98d3-d0df5cbb3ccb)


Note

This script is tailored for use within the Homey ecosystem and adheres to its scripting constraints, including the use of native JavaScript and Homey's built-in functionalities. Please be aware that third-party libraries are not supported in HomeyScript.
