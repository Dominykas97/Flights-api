**How to install**
At the project's root directory execute:
`cd backend; npm install`

Go back one folder and execute:
`cd frontend; npm install`

MySQL database is hosted on the cloud. It should connect without any configuration. I understand that it is a bad practice, but it makes it easy to share. Normally, I would store sensitive data in .env.

**How to run**

Open one terminal and from the project's root directory execute: `cd backend; npm start`. The backend will start at http://localhost:4000. 

Open another terminal and from the project's root directory execute: `cd frontend; npm start`. The frontend will start at http://localhost:3000. It should open automatically in a new tab in a web browser.

**Functionality**

There are five parts:
1. 2 airports have to be provided in input boxes. Average journey time is shown. Timezone differences between airports are taken into consideration. In the browser's console, each flight time (in seconds) for the selected journey is shown as well.
2. Departure airport has to be provided in the input box. The most popular weekday is shown. How many flights each weekday had is shown in the console.
3. Clicking "Fetch business flights' percentage" will not change anything. It fetches flights by their booking class. This data is shown in the browser's console.
4. A country has to be provided in the input box. After clicking a button, airports in that country are shown in the browser's console. Furthermore, how many flights each airport had, is displayed in the console.
5. Clicking the button fetches cost of flights grouped by airlines. The highest average cost airline and its cost are displayed. The list of airlines, individual prices of flights and average price per airline is shown in the browser's console. 

**Database**

Both full and segments CSV files were uploaded to 2 MySQL tables. 4 additional columns are added for easier information retrieval: journey times (inbound, outbound and segments) and prices converted to GBP.

CSV files have to placed to *flighdata_B* folder, located at the project's root. Both CSV files can be processed to the database by calling http://localhost:4000/csvtosql.

Any CSV files will not work, since types of columns for MySQL are hardcoded.

**Notes**

There is some duplication of flights when calculating the total number of flights. If there is a flight A -> B -> C, in my implementation this counts as 3 flights if A -> C is a full flight.

When calculating average journey time for segments, some flights have negative journey time, even with timezone adjustment. If `deptime` or `arrtime` is `00:00:00`, that flight time is ignored.
