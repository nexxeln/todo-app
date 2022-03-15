import { useState } from "react";
import { useForm } from "@mantine/hooks";
import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";
import { Endpoint, Todo } from "../App";
import { KeyedMutator } from "swr";

const AddTodo = ({ mutate }: { mutate: KeyedMutator<Todo[]> }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      body: ""
    }
  });
  const createTodo = async (vals: { title: string; body: string }) => {
    const updated = await fetch(`${Endpoint}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vals)
    }).then((r) => r.json());

    mutate(updated);

    form.reset();

    setOpen(false);
  };

  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)} title="Create todo">
        <form onSubmit={form.onSubmit(createTodo)}>
          <TextInput
            required
            mb={12}
            label="Todo"
            placeholder="Task"
            {...form.getInputProps("title")}
          />
          <Textarea
            required
            mb={12}
            label="Body"
            placeholder="Description"
            {...form.getInputProps("body")}
          />

          <Button type="submit">Create Todo</Button>
        </form>
      </Modal>
      <Group position="center">
        <Button fullWidth mb={12} onClick={() => setOpen(true)}>
          Add Todo
        </Button>
      </Group>
    </>
  );
};

export default AddTodo;
