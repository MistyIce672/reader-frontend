import React, { useState, useEffect } from "react";
import { wordService } from "../../services/word.service";
import { useParams, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const KnownWords = () => {
  const { originalLanguage, translatedLanguage } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({
    originalWord: "",
    translatedWord: "",
    originalLanguage: originalLanguage,
    translatedLanguage: translatedLanguage,
    translate: false, // Add this new field
  });

  useEffect(() => {
    loadWords();
  }, [originalLanguage, translatedLanguage]);

  const loadWords = async () => {
    try {
      const response = await wordService.getWordsByLanguages(
        originalLanguage,
        translatedLanguage,
      );
      setWords(response.data);
    } catch (error) {
      console.error("Error loading words:", error);
    }
  };

  const handleDelete = async (wordId) => {
    try {
      await wordService.deleteWord(wordId);
      loadWords();
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  const handleToggleTranslate = async (wordId, currentTranslate) => {
    try {
      await wordService.updateTranslate(wordId, !currentTranslate);
      loadWords();
    } catch (error) {
      console.error("Error updating translate status:", error);
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    try {
      await wordService.addWord(newWord);
      setNewWord({
        ...newWord,
        originalWord: "",
        translatedWord: "",
      });
      loadWords();
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Vocabulary
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Known Words
          </p>
        </div>

        {/* Add new word form */}
        <div className="max-w-3xl mx-auto mb-12">
          <form
            onSubmit={handleAddWord}
            className="grid grid-cols-1 gap-4 sm:grid-cols-4" // Changed to 4 columns
          >
            <input
              type="text"
              placeholder="Original Word"
              value={newWord.originalWord}
              onChange={(e) =>
                setNewWord({ ...newWord, originalWord: e.target.value })
              }
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Translated Word"
              value={newWord.translatedWord}
              onChange={(e) =>
                setNewWord({ ...newWord, translatedWord: e.target.value })
              }
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
            <div className="flex items-center">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={newWord.translate}
                  onChange={(e) =>
                    setNewWord({ ...newWord, translate: e.target.checked })
                  }
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Translate</span>
              </label>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Word
            </button>
          </form>
        </div>

        {/* Words list */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {words.map((word) => (
              <div
                key={word._id}
                className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-900">
                    {word.originalWord} → {word.translatedWord}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={word.translate}
                      onChange={() =>
                        handleToggleTranslate(word._id, word.translate)
                      }
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700">Translate</span>
                  </label>
                  <button
                    onClick={() => handleDelete(word._id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <DeleteIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnownWords;
