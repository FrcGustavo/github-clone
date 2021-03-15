import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loading, FileCommit } from '../../components';
import { getBranches, getCompare, createPull, createMerge } from '../../api';
import { useRequest } from '../../hooks';
import './styles.css';

const SlecteInputs = ({ name, label, options, onChange }) => {
  return (
    <div className="createPull__selectBranch">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} onChange={onChange}>
        {options.map(({ name }) => (
          <option value={name}>{name}</option>
        ))}
      </select>
    </div>
  );
};

const CreatePull = () => {
  const { author, repositoryName } = useParams();
  const { data, loading } = useRequest(getBranches, { author, repositoryName });
  const [compare, setCompare] = useState({});
  const [branches, setBranches] = useState(false);
  const [files, setFiles] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [handleError, setHandleError] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);

  const onChange = (_event) => {
    const { name, value } = _event.target;
    setCompare({
      ...compare,
      [name]: value,
    });
  };

  const onChangeForm = (_event) => {
    const { name, value } = _event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onClickHandleSelectButton = () => {
    setHandleError(false);
    setHandleLoading(true);
    getCompare({ author, repositoryName, ...compare })
      .then((data) => {
        setFiles(data.files);
      })
      .catch((err) => {
        setHandleError(err);
      })
      .finally(() => setHandleLoading(false));
  };

  const onSubmitHandleCretePull = () => {
    setHandleError(false);
    setHandleLoading(true);
    createPull({ author, repositoryName, ...form, ...compare })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        setHandleError(err);
      })
      .finally(() => setHandleLoading(false));
  };

  const onSubmitHandleCreteMerge = () => {
    setHandleError(false);
    setHandleLoading(true);
    createMerge({ author, repositoryName, ...form, ...compare })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        setHandleError(err);
      })
      .finally(() => setHandleLoading(false));
  };

  useEffect(() => {
    setBranches(data);
  }, [setBranches, data]);
  if ((loading && !data) || !branches)
    return (
      <div className="page">
        <Loading />
      </div>
    );
  return (
    <div className="page">
      <h1 className="page__title">Compare changes</h1>
      <div className="card createPull__selectBranches">
        <SlecteInputs
          name="base"
          label="Base:"
          options={branches}
          onChange={onChange}
        />
        <span>{'<-'}</span>
        <SlecteInputs
          name="compare"
          label="Compare:"
          options={branches}
          onChange={onChange}
        />
        <button
          className="createPull__btnCompare"
          onClick={onClickHandleSelectButton}
        >
          Compare
        </button>
      </div>

      {handleLoading && <Loading />}

      {!handleError && !handleLoading && files && (
        <div className="card createPull__info">
          <div className="createPull__field">
            <label htmlFor="title">Titulo</label>
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={onChangeForm}
            />
          </div>
          <div className="createPull__field">
            <label htmlFor="body">Description</label>
            <textarea
              id="body"
              name="body"
              value={form.body}
              onChange={onChangeForm}
            />
          </div>
          <button className="createPull__btn" onClick={onSubmitHandleCretePull}>
            Create
          </button>
          <button
            className="createPull__btn"
            onClick={onSubmitHandleCreteMerge}
          >
            Merge
          </button>
        </div>
      )}

      <div>
        {!handleLoading &&
          files &&
          files.map((file) => <FileCommit file={file} />)}
        {handleError && !files && <h1>Upss a ocurrido un error</h1>}
      </div>
    </div>
  );
};

export default CreatePull;
