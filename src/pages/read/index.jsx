import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "../../services/book.service";
import { wordService } from "../../services/word.service";
import CommonWordsPopup from "./components/CommonWordsPopup";

const ReadPage = () => {
  const [pageContent, setPageContent] = useState({});
  const [wordIndex, setWordIndex] = useState(null);
  const [original, setOriginal] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(null);
  const [translatedWord, setTranslatedWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

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
      (knownWord) => knownWord.translatedWord.toLowerCase() == searchWord,
    );

    return {
      word: foundWord ? foundWord.originalWord : word,
      isTranslated: !!foundWord,
    };
  };

  const handleWordClick = (sentence, word) => {
    setOriginal(false);
    setTranslatedWord(null);
    if (sentenceIndex == sentence) {
      if (wordIndex == word) {
        setWordIndex(-1);
        return;
      } else if (wordIndex == -1) {
        setWordIndex(null);
        setSentenceIndex(null);
      } else {
        setWordIndex(word);
      }
    } else {
      setWordIndex(word);
      setSentenceIndex(sentence);
    }
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
    } else if (wordIndex == null && sentenceIndex == null) {
      setShowOriginal(!showOriginal);
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToLibrary}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Back to Library
            </button>
            <div className="text-gray-600">
              Page {page} of {pageContent.totalPages}
            </div>
          </div>
        </div>
      </div>
      {/* Common Words Popup */}
      {showPopup && pageContent.mostCommonWords && (
        <CommonWordsPopup
          mostCommonWords={pageContent.mostCommonWords}
          setPageContent={setPageContent}
          setShowPopup={setShowPopup}
          setError={setError}
          pageContent={pageContent}
        />
      )}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-indigo-600">Loading...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 prose max-w-none">
              {pageContent.translations?.map((translation, sIndex) => (
                <span
                  key={sIndex}
                  className={`${
                    wordIndex == -1
                      ? sentenceIndex == sIndex
                        ? "bg-indigo-100"
                        : ""
                      : ""
                  }`}
                >
                  <>
                    {showOriginal ? ( // Check if showOriginal is true
                      <span className="text-gray-500">
                        {translation.original}
                      </span>
                    ) : original && sIndex == sentenceIndex ? (
                      <span className="text-gray-500">
                        {translation.original}
                      </span>
                    ) : (
                      <>
                        {translation.translated
                          .split(" ")
                          .map((word, wIndex) => {
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
          </div>
        )}

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-between items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-white bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Previous Page
          </button>

          {wordIndex == -1 ? (
            <button
              onClick={toggleOriginal}
              className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {original ? "Show Translated" : "Show Original"}
            </button>
          ) : (
            <button
              onClick={handleTranslate}
              className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {!translatedWord
                ? !showOriginal
                  ? "Show Original"
                  : "Translate"
                : "Translate"}
            </button>
          )}

          <button
            onClick={handleNextPage}
            disabled={page === pageContent.totalPages}
            className={`px-4 py-2 rounded-md ${
              page === pageContent.totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-white bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Next Page
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReadPage;
