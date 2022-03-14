import { useEffect } from 'react';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form';
import { MdAdd, MdClose, MdSave } from 'react-icons/md';

import { convertToJson } from '../utilities/helpers';
import { Entry, EntryForm } from '../utilities/types';

import Heteronym from './FormHeteronym';

interface Props {
  word: string | undefined;
  draft: EntryForm;
  updateLexicon: (data: Entry) => void;
  closeForm: () => void;
}

export interface BlockProps {
  watch: UseFormWatch<EntryForm>;
  setValue: UseFormSetValue<EntryForm>;
  register: UseFormRegister<EntryForm>;
}

function Form(props: Props) {
  const { word, draft, updateLexicon, closeForm } = props;

  const { register, setValue, watch, handleSubmit } = useForm<EntryForm>({
    defaultValues: draft,
  });

  useEffect(() => {
    setValue('title', draft.title);
    setValue('stem', draft.stem);
    setValue('repetition', draft.repetition);
    setValue('heteronyms', draft.heteronyms);
  }, [draft]);

  const addHeteronym = () => {
    setValue(`heteronyms.${watch('heteronyms').length}`, {
      name: '',
      definitions: [],
    });
  };

  const deleteHeteronym = (index: number) => {
    const heteronyms = watch(`heteronyms`) || [];
    heteronyms.splice(index, 1);
    setValue(`heteronyms`, heteronyms);
  };

  const onSubmit = (data: EntryForm) => {
    updateLexicon(convertToJson(data));
  };

  const formData = watch();

  if (word && draft.title && word !== draft.title) {
    return (
      <header>
        <h1>loading...</h1>
      </header>
    );
  }

  return (
    <form className="App" onSubmit={handleSubmit(onSubmit)}>
      <header>
        <h1>edit lexicon</h1>
        <button type="button" onClick={closeForm}>
          <MdClose />
        </button>
      </header>
      <section className="fields">
        <div id="word" className="grid">
          <div className="field">
            <label>
              <span className="required">title</span>
            </label>
            <input
              readOnly={!!word}
              {...register('title', { required: true })}
            />
          </div>
          <div className="field">
            <label>stem (蔡中涵大辭典)</label>
            <input {...register('stem')} />
          </div>
          <div className="field">
            <label>repetition (蔡中涵大辭典)</label>
            <input {...register('repetition')} />
          </div>
        </div>
        {formData.heteronyms.map((heteronym, index) => (
          <Heteronym
            key={index}
            index={index}
            heteronym={heteronym}
            register={register}
            setValue={setValue}
            watch={watch}
            deleteHeteronym={deleteHeteronym}
          />
        ))}
        <hr />
      </section>
      <footer className="grid">
        <button
          type="button"
          className="addHeteronym"
          onClick={() => {
            addHeteronym();
          }}
        >
          <MdAdd />
          <span>add heteronym</span>
        </button>
        <span />
        <button type="submit" className="submit">
          <MdSave />
          <span>save lexicon</span>
        </button>
        <button type="button" className="cancel" onClick={closeForm}>
          <MdClose />
          <span>cancel</span>
        </button>
      </footer>
    </form>
  );
}

export default Form;
