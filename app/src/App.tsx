import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import $ from 'jquery';

import { Entry } from './utilities/types';
import { convertToForm, getDictWord, getJSONUrl } from './utilities/helpers';
import Form from './blocks/Form';

import './App.css';

const _window = window as any;

function App() {
  // for react app preview only
  // const { dict, word } = getDictWord(window.location.hash);
  // const { data: previewData } = useQuery('draft', async () => {
  //   const res = await fetch(getJSONUrl({ dict, word }));
  //   if (!res.ok) {
  //     throw new Error('Failed to fetch draft');
  //   }
  //   return res.json();
  // });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [word, setWord] = useState<string | undefined>();
  const [sha, setSha] = useState<string | null | undefined>();
  const [data, setData] = useState<Entry>();

  const openNewForm = () => {
    setIsOpen(true);
    setWord('');
    setSha(null);
    setData({
      t: '',
      h: [],
    });
  };

  const openEditForm = () => {
    const { word } = getDictWord(window.location.hash);
    setWord(word);
    setIsOpen(true);
  };

  const closeForm = () => {
    _window.close_editor();
    setIsOpen(false);
    setWord(undefined);
  };

  const updateLexicon = async (data: Entry) => {
    _window.update_lexicon(word, sha, data, closeForm);
  };

  useEffect(() => {
    $('button:contains("編輯本條目")').on('mouseup', openEditForm);
    $('button:contains("新增條目")').on('mouseup', openNewForm);
  }, []);

  useEffect(() => {
    const getLexicon = async () => {
      const { sha, data } = await _window.get_lexicon(word);
      if (sha && data) {
        setSha(sha);
        setData(data);
      }
    };
    if (isOpen && word) {
      getLexicon();
    }
  }, [isOpen, word]);

  return data && isOpen ? (
    <Form
      word={word}
      draft={convertToForm(data)}
      updateLexicon={updateLexicon}
      closeForm={closeForm}
    />
  ) : null;
}

export default App;
