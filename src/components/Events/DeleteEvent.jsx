import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import { deleteEvent } from "../util/http.js";
import { queryClient } from "../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function DeleteEvent() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    //DON'T pass the argument to the function
    //you want to explictly declare the function not use the fucntione expression to call it
    //old deltetEvent({id}) trigger twice. the first time bind running for once
    //the later useMutation call it twice,(results 404 for the fetch request)

    mutationFn: deleteEvent,
    onSuccess: () => {
      //navigate to the events page

      queryClient.invalidateQueries({
        // invalid all the query with key: events
        queryKey: ["events"],
        //the reason why trigger the get request error
        //i didn't disable the refresh the current component when the delete event happens
        //so the old delteed eventb is tried to access again
        refetchType: "none",
      });
      navigate("/events");
    },
  });
  const deleteHandler = (e) => {
    e.preventDefault();
    //writing {id} rather than {id: id} is ok, this is not like the newEvent.jsx that needs to extract the data from the children component
    //and pass via the function parameter (check the EventForm, check NewEvent)
    mutate({ id });
  };

  function handleClose() {
    navigate("../");
  }

  return (
    <Modal onClose={handleClose}>
      {!isPending && (
        <>
          <Link to="../" className="button text-align: center">
            Cancel
          </Link>
          <p></p>
          <button type="button" className="button" onClick={deleteHandler}>
            Delete Event
          </button>
        </>
      )}
      {isPending && <p>Deleting ... </p>}
      {isError && (
        <ErrorBlock
          title="Failed to delete current event"
          message={error.message}
        ></ErrorBlock>
      )}
    </Modal>
  );
}
