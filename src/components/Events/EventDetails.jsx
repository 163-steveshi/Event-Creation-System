import { Link, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import Header from "../Header.jsx";
import { fetchEvent } from "../util/http.js";

export default function EventDetails() {
  //get the dynamic segment: id of the current url path
  const { id } = useParams();
  //use the useQuery to ruqest the data
  const { data, isPending, isError, error } = useQuery({
    //in oreder for the edite event to access the query
    //assign the same query key for point to the same query
    queryKey: ["events", id],
    //fetchEvent needs to pass a signal and the id of the current url
    queryFn: ({ signal }) => {
      return fetchEvent({ id, signal });
    },
  });

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      {isPending && <p className="center">Loading selectable Event...</p>}
      {isError && (
        <ErrorBlock
          title="Failed to load current event"
          message={error.message}
        ></ErrorBlock>
      )}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              {/* to: do enable the delete button: use the delete event with react query useMutation*/}
              <Link to="delete">Delete</Link>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          {/* fetch the data with the useQuery  */}

          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt="" />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {`${new Date(data.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })} @ ${data.time}`}{" "}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
