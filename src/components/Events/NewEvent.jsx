import { Link, useNavigate } from "react-router-dom";
//optimize for data changing
//request not send instanly whe the compoent is render
//send when you want to send them
//manual send the data

import { useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../util/http.js";
export default function NewEvent() {
  const navigate = useNavigate();
  //the mutate is the useMutation object returned function
  //which is responsible for additional callback: ex. sending the data to the backend
  const { mutate, isPending, isError, error } = useMutation({
    // you don't need a key for the mutation
    //they don't need to cache data (not behave like useQuerru)
    //only change data to the backend
    mutationFn: createNewEvent,
    //onSucess: want a method as a value
    //execute the function whe the mutate operation is done
    onSuccess: () => {
      //since we update a new event
      //invalid the query for getting all events from the backend

      queryClient.invalidateQueries({
        // invalid all the query with key: events
        queryKey: ["events"],
      });

      //now we can use the useNavigate to navigate the event tab (close the tab)
      navigate("/events");
    },
  });
  //now use the mutate to send the data
  function handleSubmit(formData) {
    //send the data as the backend desires
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed to create event. Please try again later. :("
          }
        ></ErrorBlock>
      )}
    </Modal>
  );
}
