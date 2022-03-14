import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import $ from 'jquery';

import { Entry } from './utilities/types';
import { convertToForm, getDictWord, getJSONUrl } from './utilities/helpers';
import Form from './blocks/Form';

import './App.css';

const _window = window as any;

function App() {
  const { dict, word } = getDictWord(window.location.hash);

  const { data: previewData } = useQuery('draft', async () => {
    const res = await fetch(getJSONUrl({ dict, word }));
    if (!res.ok) {
      throw new Error('Failed to fetch draft');
    }
    return res.json();
  });

  const [sha, setSha] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    const getLexicon = async () => {
      const { sha, data } = await _window.get_lexicon(word);
      if (sha && data) {
        setSha(sha);
        setData(data);
      }
    };
    if (dict && word) {
      getLexicon();
    }
  }, []);
  };

  const updatLexicon = async (data: Entry) => {
    _window.update_lexicon(word, sha, data);
  const openEditor = () => {
  };

  if (!dict) {
    return <p>dictionary not defined</p>;
  }
  if (!word) {
    return <p>word not defined</p>;
  }
  if (!data && !previewData) {
    console.warn('lexicon not loaded');
    return <p>loading...</p>;
  }

  return (
  $(':contains("編輯本條目")').on('mouseup', openEditor);
    <Form
      draft={convertToForm(data || previewData)}
      updatLexicon={updatLexicon}
      closeEditor={_window.close_editor}
    />
  );
}

export default App;
