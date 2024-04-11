import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState<any[]>([]);
  const [text, setText] = useState<string>("");
  const [displayCards, setDisplayCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Added loading state

  useEffect(() => {
    setIsLoading(true); // Start loading
    const endpoint = process.env.SERVER_BASE + "/cards";
    const bearerToken = process.env.AUTH;
    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCards(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      })
      .catch((error) => console.error("❌ Error fetching cards:", error))
      .finally(() => setIsLoading(false)); // Stop loading irrespective of success or failure
  }, []);

  useEffect(() => {
    const filteredCards = cards.map((a) => {
      return (a.name as string).toLocaleLowerCase().includes(text)
        ? a
        : undefined;
    });
    const filteredArr = filteredCards.filter((item) => item !== undefined);

    setTotalPages(Math.ceil(filteredArr.length / itemsPerPage));
    setCurrentPage(1);
    setDisplayCards(filteredArr.slice(0, itemsPerPage));
  }, [text, cards]);

  const paginate = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const pageItems = cards.slice(startIndex, endIndex);
    setDisplayCards(pageItems);
    setCurrentPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
  };

  useEffect(() => {
    const filteredCards = cards.map((a) => {
      return (a.name as string).toLocaleLowerCase().includes(text)
        ? a
        : undefined;
    });
    const filteredArr = filteredCards.filter((item) => item !== undefined);
    setDisplayCards(filteredArr);
  }, [text]);

  const onCardClick = (card: any) => {
    setSelectedCard(card);
  };

  return (
    <div className="container">
      {isLoading ? (
        <div className="loader-container">
        {/* Replace this div with your spinner or loader component */}
        <div className="loader"></div>
      </div>
        ) : (
        <div id="leftContainer">
          <div className="thumbnail">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input type="text" value={text} onChange={handleInputChange} />
              <button
                onClick={() => {
                  setSelectedCard(undefined);
                }}
              >
                Clear card
              </button>
            </div>
            <div className="scrollcards">
              {displayCards.map((card: any) => {
                return (
                  <div
                    onClick={() => onCardClick(card)}
                    style={{ display: "flex" }}
                  >
                    <img src={card.image} />
                    <span>{card.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="pagination-controls">
              <button
                disabled={currentPage <= 1}
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <div id="rightContainer">
        {selectedCard && (
          <div className="containerImage">
            <img id="displayedImage" src={selectedCard.image} />
            <a
              style={{
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.87)",
                fontWeight: 600,
              }}
            >
              {selectedCard.name}
            </a>
            <a
              style={{
                fontStyle: "italic",
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.87)",
              }}
            >
              {selectedCard.cardType}
            </a>
            <div
              style={{ marginTop: "5px" }}
              dangerouslySetInnerHTML={{ __html: selectedCard.cardText }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
