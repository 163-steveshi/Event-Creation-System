import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";
export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();

  //
  //Difference between isLoading and isPending:
  // the isLoading is considered as false when the query is disable

  // the isPending is considered as true when the query is  disable
  const { data, isLoading, isError, error } = useQuery({
    // Don't set the query key to be the same if the two query request data are not 100% the same.
    //so we also pass an additional object to dynamic bind the search term

    //we can't use the searchElement.current.value directly
    //it is a value from the ref (ref won't trigger the rerender, so the new search term will not be send by query)

    //hence we use a state to track the term, and update acording to the term submit, the the change on state will trigger the state updating

    queryKey: ["events", { searchTerm: searchTerm }],
    //the query return a signal
    //reprsents the record of current query
    //action, this query request can be terminated with the signal if user switch to another page--> save the server resource

    //
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),

    //

    //enabled property in the  react query

    // true: allow sending the query
    // false: not allow to send the query

    //Only want the initial time not to execute the query when the searching box is empty,
    // set to check the state to be undefined, so the boolean will only be evaluated to false at the initial time.
    // Later, the boolean will be evaluated as true b/c we have to type before. (empty box is not empty string rather than undefined).
    enable: searchTerm !== undefined,
  });
  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events</p>;
  if (isLoading) {
    content = <LoadingIndicator></LoadingIndicator>;
  }
  if (isError)
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events"}
      ></ErrorBlock>
    );
  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event}></EventItem>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
