**How to install**

`cd backend; npm install`

`cd frontend; npm install`

MySQL database is also used, but it is hosted on the cloud. It should connect without any configuration. I understand that it is a bad practice, but it makes it easy to share. Normally, I would store sensitive data in .env.

**How to run**

Open one terminal and from the project's root directory execute: `cd backend; npm start`. The backend will start at http://localhost:4000. 

Open another terminal and from the project's root directory execute: `cd frontend; npm start`. The frontend will start at http://localhost:3000. It should open automatically in a new tab in a web browser.

**Functionality**

There are 5 parts:
1. 2 airports have to be provided in input boxes. Average journey time is shown. Timezone differences between airports are taken into consideration. In browser's console each individual flight time (in seconds) for selected journey is shown as well.
2. Departure airport has to be provided in input box. The most popular weekday is shown. How many flights each weekday had is shown in the console.
3. Clicking "Fetch bussiness flights' percentage" will not change anything. It fetches flights by their booking class. This data is shown in the browser's console.
4. A country has to be provided in input box. After clicking a button, airports in that country are shown in the browser's console. Furthermore, how many flights each airport had, is displayed in the console.
5. Clicking the button fetches cost of fligts grouped by airlines. The highest average cost airline and its cost are displayed. The list of airlines, individual prices of flights and average price per airline is shown in the browser's console. 

**Database**

Both full and segments csv files were uploaded to 2 MySQL tables. 4 additional columns are added for easier information retrieval: journey times (inbound, outbound and segments) and prices converted to GBP.

Csv files have to placed to *flighdata_B* folder, located at the project's root. Both csv files can be processed to the database by calling http://localhost:3000/csvtosql.

**Notes**

There is some duplication of flights when calculating the total number of flights. If there is a flight A -> B -> C, in my implementation this counts as 3 flights if A -> C is a full flight.

When calculating average journey time for segments, some flights have negative journey time, even with timezone adjustment. If `deptime` or `arrtime` is `00:00:00`, that flight time is ignored.