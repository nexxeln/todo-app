import { Box, List, ThemeIcon } from "@mantine/core";
import { CheckCircleFillIcon, TrashIcon } from "@primer/octicons-react";
import useSWR from "swr";
import "./App.css";
import AddTodo from "./components/AddTodo";

export const Endpoint = "http://localhost:4000";

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

const fetcher = (url: string) =>
  fetch(`${Endpoint}/${url}`).then((r) => r.json());

function App() {
  const { data, mutate } = useSWR<Todo[]>(`api/todos`, fetcher);

  const completeTodo = async (id: number) => {
    const updated = await fetch(`${Endpoint}/api/todos/${id}/done`, {
      method: "PATCH"
    }).then((r) => r.json());

    mutate(updated);
  };

  const deleteTodo = async (id: number) => {
    const updated = await fetch(`${Endpoint}/api/todos/${id}`, {
      method: "DELETE"
    }).then((r) => r.json());

    mutate(updated);
  };

  return (
    <Box
      sx={(theme) => ({
        padding: "2rem",
        width: "100%",
        maxWidth: "40rem",
        margin: "0 auto"
      })}
    >
      <List spacing="xs" size="sm" mb={12} center>
        {data?.map((todo) => {
          return (
            <List.Item
              sx={(theme) => ({
                cursor: "pointer"
              })}
              key={`todo_${todo.id}`}
              icon={
                todo.done ? (
                  <ThemeIcon color={"teal"} size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon
                    onClick={() => completeTodo(todo.id)}
                    color={"gray"}
                    size={24}
                    radius="xl"
                  >
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                )
              }
            >
              {todo.title}
              <ThemeIcon
                onClick={() => deleteTodo(todo.id)}
                color="red"
                size={24}
                radius="md"
                ml={24}
              >
                <TrashIcon size={20} />
              </ThemeIcon>
            </List.Item>
          );
        })}
      </List>
      <AddTodo mutate={mutate} />
    </Box>
  );
}

export default App;
