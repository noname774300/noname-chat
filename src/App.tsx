import React from "react";
import io from "socket.io-client";
import styled from "styled-components";

type Messages = Message[];

type Message = {
  id: string;
  userId: string;
  name: string;
  content: string;
  time: string;
};

const socket = io({ autoConnect: false });

export default function App() {
  const [name, setName] = React.useState(loadName());
  const [content, setContent] = React.useState("");
  const [messages, setMessages] = React.useState<Messages>([]);
  const [, signUpLoading] = useFetch("api/signup");
  const [messagesLoading, setMessagesLoading] = React.useState(true);
  const onLoadMessages = (messages: Messages) => {
    if (messagesLoading) setMessagesLoading(false);
    setMessages(messages);
  };
  React.useEffect(() => {
    if (signUpLoading) return () => {};
    socket.connect();
    socket.on("messages", onLoadMessages);
    return () => {
      socket.off("messages", onLoadMessages);
      socket.disconnect();
    };
  }, [signUpLoading]);
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    saveName(name);
    setName(name);
  };
  const onChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.length === 0) return;
    const message = {
      name: name.length > 0 ? name : "noname",
      content
    };
    socket.emit("message", message);
    setContent("");
  };
  return (
    <>
      <Header>
        <Title>noname chat</Title>
      </Header>
      {!messagesLoading && (
        <>
          <Messages reversed>
            {messages.map(({ id, userId, name, content, time }) => (
              <MessageWrapper key={id}>
                <dl>
                  <dt>
                    <MessageName>{name}</MessageName>{" "}
                    <MessageUserId>#{userId.slice(0, 4)}</MessageUserId>{" "}
                    <MessageTime>
                      @{new Date(parseInt(time, 10)).toLocaleString()}
                    </MessageTime>
                  </dt>
                  <MessageContent>{content}</MessageContent>
                </dl>
              </MessageWrapper>
            ))}
          </Messages>
          <Footer>
            <Form onSubmit={onSubmit}>
              <InputWrapper>
                <NameInput
                  id="name"
                  className="input-name"
                  placeholder="name"
                  type="text"
                  value={name}
                  onChange={onChangeName}
                />
              </InputWrapper>
              <InputWrapper>
                <ContentInput
                  id="content"
                  className="input-content"
                  type="text"
                  value={content}
                  onChange={onChangeContent}
                />{" "}
                <SubmitInput
                  className="input-post"
                  type="submit"
                  value="Post"
                />
              </InputWrapper>
            </Form>
          </Footer>
        </>
      )}
    </>
  );
}

function saveName(name: string) {
  localStorage.setItem("name", name);
}

function loadName() {
  return localStorage.getItem("name") || "";
}

function useFetch(input: RequestInfo, init?: RequestInit) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  async function fetchUrl() {
    const response = await fetch(input, init);
    const json = await response.json();
    setData(json);
    setLoading(false);
  }
  React.useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}

const Header = styled.div`
  background: rgb(0, 0, 0);
  box-shadow: 0 0 0.5rem 0.5rem rgb(0, 0, 0);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 1rem;
  padding: 0.5rem 0;
`;

const Messages = styled.ol`
  list-style: none;
  padding: 0.5rem 2rem;
`;

const MessageWrapper = styled.li`
  padding-bottom: 1rem;
`;

const MessageName = styled.span`
  font-size: 0.8rem;
`;

const MessageUserId = styled.span`
  font-size: 0.8rem;
`;

const MessageTime = styled.span`
  font-size: 0.8rem;
`;

const MessageContent = styled.dd`
  font-size: 1.2rem;
`;

const Footer = styled.div`
  background: rgb(0, 0, 0);
  bottom: 0;
  box-shadow: 0 0 2rem 2rem rgb(0, 0, 0);
  padding: 0 2rem;
  position: sticky;
`;

const Form = styled.form`
  padding: 0.4rem 0;
`;

const InputWrapper = styled.div`
  padding-bottom: 0.4rem;
  &:last-child {
    padding-bottom: 0rem;
  }
`;

const NameInput = styled.input`
  border: 2px inset rgb(255, 255, 255);
  padding: 2px 0;
`;

const ContentInput = styled.input`
  border: 2px inset rgb(255, 255, 255);
  padding: 2px 0;
`;

const SubmitInput = styled.input`
  border: 2px outset rgb(255, 255, 255);
  padding: 2px 0.2rem;
  &:active {
    border: 2px inset rgb(255, 255, 255);
  }
`;
