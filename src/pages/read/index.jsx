import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "../../services/book.service";
import { wordService } from "../../services/word.service";

const ReadPage = () => {
  const [pageContent, setPageContent] = useState({});
  const [wordIndex, setWordIndex] = useState(null);
  const [original, setOriginal] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(null);
  const [translatedWord, setTranslatedWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const { bookId, page } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const content = await bookService.getPage(bookId, page);
        setPageContent(content);
        if (content.mostCommonWords?.length > 0) {
          setShowPopup(true);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load page content");
        setLoading(false);
        console.error(err);
      }
    };
    fetchPageContent();
  }, [bookId, page]);

  const checkAndTranslate = (word) => {
    const searchWord = word.toLowerCase();

    const foundWord = pageContent.knownWords.find(
      (knownWord) => knownWord.translation.toLowerCase() == searchWord,
    );

    return {
      word: foundWord ? foundWord.word : word,
      isTranslated: !!foundWord,
    };
  };

  const handleWordClick = (sentence, word) => {
    setOriginal(false);
    setTranslatedWord(null);
    if (sentenceIndex == sentence && wordIndex == word) {
      setWordIndex(-1);
      return;
    }
    setWordIndex(word);
    setSentenceIndex(sentence);
  };

  const handleAddWords = async () => {
    try {
      await wordService.addWord(
        pageContent.mostCommonWords.map((item) => item.word),
        pageContent.originalLanguage,
      );
      setShowPopup(false);

      // Recall the API to get updated page content
      const updatedContent = await bookService.getPage(bookId, page);
      setPageContent(updatedContent);
    } catch (err) {
      setError("Failed to add words");
      console.error(err);
    }
  };

  const handleIgnore = () => {
    setShowPopup(false);
  };

  const handleTranslate = async () => {
    if (wordIndex !== null && sentenceIndex !== null) {
      try {
        if (!translatedWord) {
          const selectedWord =
            pageContent.translations[sentenceIndex].translated.split(" ")[
              wordIndex
            ];

          // Call the translate API
          const translation = await wordService.translate(
            selectedWord,
            pageContent.translatedLanguage,
            pageContent.originalLanguage,
          );
          setTranslatedWord(translation.word);
        } else {
          setTranslatedWord(null);
        }
      } catch (err) {
        setError("Failed to translate word");
        console.error(err);
      }
    }
  };

  const toggleOriginal = () => {
    setOriginal(!original);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      navigate(`/books/${bookId}/read/${parseInt(page) - 1}`);
    }
  };

  const handleNextPage = () => {
    if (pageContent.totalPages && page < pageContent.totalPages) {
      navigate(`/books/${bookId}/read/${parseInt(page) + 1}`);
    }
  };

  const handleBackToLibrary = () => {
    navigate("/home");
  };

  if (error) {
    return <div className="text-red-600 p-4 text-center">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {showPopup && pageContent.mostCommonWords && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Most Common Words</h2>
            <div className="mb-4">
              {pageContent.mostCommonWords.map((word, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                  <span className="font-bold">{word.word}</span> -{" "}
                  <span>{word.translation}</span>
                  <span className="text-gray-500 ml-2">
                    (Frequency: {word.frequency})
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleIgnore}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Ignore
              </button>
              <button
                onClick={handleAddWords}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add to Words
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-8">
        <button
          onClick={handleBackToLibrary}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Library
        </button>
        <h1 className="text-3xl font-bold text-center my-4">{""}</h1>
        <div className="text-center text-gray-600">
          Page {page} of {pageContent.totalPages}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="prose max-w-none">
            {pageContent.translations.map((translation, sIndex) => (
              <span
                key={sIndex}
                className={`${wordIndex == -1 ? (sentenceIndex == sIndex ? "bg-yellow-200" : "") : ""}`}
              >
                <>
                  {original && sIndex == sentenceIndex ? (
                    <span className="text-gray-500">
                      {translation.original}
                    </span>
                  ) : (
                    <>
                      {translation.translated.split(" ").map((word, wIndex) => {
                        const translationResult = checkAndTranslate(word);
                        return (
                          <span
                            className={`${
                              sentenceIndex == sIndex
                                ? wordIndex == wIndex
                                  ? "bg-sky-200"
                                  : ""
                                : ""
                            } ${translationResult.isTranslated ? "bg-green-100" : ""}`}
                            onClick={() => {
                              handleWordClick(sIndex, wIndex);
                            }}
                            key={wIndex}
                          >
                            {sentenceIndex == sIndex
                              ? wordIndex == wIndex
                                ? translatedWord
                                  ? translatedWord
                                  : word
                                : translationResult.word
                              : translationResult.word}{" "}
                          </span>
                        );
                      })}
                    </>
                  )}
                </>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Previous Page
        </button>
        {wordIndex == -1 ? (
          <button
            onClick={toggleOriginal}
            className="px-4 py-2 rounded-lg ${
          page === pageContent.totalPages bg-blue-500 hover:bg-blue-600 text-white"
          >
            {original ? "Show Translated" : "Show Original"}
          </button>
        ) : (
          <button
            onClick={handleTranslate}
            className="px-4 py-2 rounded-lg ${
          page === pageContent.totalPages bg-blue-500 hover:bg-blue-600 text-white"
          >
            {!translatedWord ? "Show Original" : "Translate"}
            Translate
          </button>
        )}
        <button
          onClick={handleNextPage}
          disabled={page === pageContent.totalPages}
          className={`px-4 py-2 rounded-lg ${
            page === pageContent.totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default ReadPage;
