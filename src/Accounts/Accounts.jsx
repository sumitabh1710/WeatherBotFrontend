import axios from "axios";
import React, { useEffect, useState } from "react";

const Accounts = ({ logOut, profile }) => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [sendMessage, setSendMessage] = useState(false);
  const [chatId, setChatId] = useState();

  let helperSet = new Set();

  useEffect(() => {
    if (!data) {
      axios
        .get("http://localhost:4000/updates")
        .then((res) => {
          setData(res?.data);
          res?.data?.forEach((each) => {
            if (!helperSet.has(each?.message?.chat?.id)) {
              helperSet.add(each?.message?.chat?.id);
            }
          });
          setUsers(helperSet);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/current.json",
      params: { q: "53.1,-0.13" },
      headers: {
        "X-RapidAPI-Key": "cee0feb44bmsh4ac396c48e9e436p11c735jsnd114a467b728",
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };
    if (!weatherData) {
      axios
        .request(options)
        .then((res) => {
          setWeatherData(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (weatherData) {
      const message = `Temperature in ${
        weatherData?.location?.name + ", " + weatherData?.location?.country
      } is ${weatherData?.current?.temp_c} and it's a ${
        weatherData?.current?.condition?.text
      } day`;
      setTextMessage(message);
      setWeatherData(null);
    }
  }, [weatherData]);

  useEffect(() => {
    if (sendMessage) {
      console.log(sendMessage);
      let body = {
        chat_id: chatId?.toString(),
        text: textMessage,
      };
      axios
        .post("http://localhost:4000/send", body)
        .then((res) => {
          console.log(res);
          setSendMessage(false);
        })
        .catch((err) => {
          console.log(err);
          setSendMessage(false);
        });
    } else {
      console.log(sendMessage);
    }
  }, [sendMessage]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        color: "#36454F",
        width: "100%",
        height: "100%",
        justifyContent: "space-around",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "80%",
          backgroundColor: "whitesmoke",
          borderRadius: "1%",
        }}
      >
        <div style={{ margin: "5%" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <p style={{ width: "25%", textAlign: "center" }}>Id</p>
            <p style={{ width: "25%", textAlign: "center" }}>Message</p>
            <p style={{ width: "25%", textAlign: "center" }}>Name</p>
            <p style={{ width: "25%", textAlign: "center" }}>send Button</p>
          </div>
          {data?.map((each) => (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <p style={{ width: "25%", textAlign: "center" }}>
                {each?.message?.chat?.id}
              </p>
              <p style={{ width: "25%", textAlign: "center" }}>
                {each?.message?.text}
              </p>
              <p style={{ width: "25%", textAlign: "center" }}>
                {each?.message?.chat?.first_name}
              </p>
              <button
                className="submit"
                onClick={() => {
                  setSendMessage(true);
                  setChatId(each?.message?.chat?.id);
                }}
                style={{ width: "25%" }}
              >
                send
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          logOut();
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default Accounts;
