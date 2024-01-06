import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../util/http.js";

export default function NewEventsSection() {
  // Define a property object inside the useQuery
  //useQuery needs functions returns a promise.

  //after destructing the return values
  //the data is the return promise value

  //the isPending is an boolean provided by react query for the state of the transition

  //the isError is an boolean  provided by react query for checking the promise's error (notic the promise nust throw an error for using this feature)

  //the error object will consist of the error if the isError is true.

  const { data, isPending, isError, error } = useQuery({
    // give the query request a identifier
    //so the react query can catche the data
    //for reuse in the future if you try to send the same request in the future
    //show the data faster to the user if you have a existed copy
    //the key stored in an array managed by the react query
    queryKey: ["events", { max: 3 }],
    // queryFn property to call the fetch data function
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    //staleTime: when does the react send the behind-the-scenes request again.

    // Default value is 0: react query will use the cached data but also request the same data again (every time to do the new cach) to check the update
    // . The other value is waiting for x milliseconds to send another request

    staleTime: 5000,
  });
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    // the throwed error property has the property: info
    //check the http.js
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.messagec || "Failed to fetch the event"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
