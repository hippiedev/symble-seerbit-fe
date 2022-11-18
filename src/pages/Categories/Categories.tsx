import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../../constants/categories-data';
import Button from '../../components/UI/atoms/Button/Button';
import styles from './Categories.module.scss';
import { useUpdateUserMutation } from '../../redux/feature/user/userApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { onSetCategories } from '../../redux/feature/user/userSlice';
import Popup from '../../components/UI/molecules/Popup/Popup';

function Categories() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [setPreference, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  const { user, message } = useAppSelector((state: RootState) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState<
    { id: number; name: string }[]
  >([]);
  const addCategory = (prevCategories, categoryToAdd) => {
    // check if category has already been selected
    const existingCategory = prevCategories.find(
      (categoryItem) => categoryItem.id === categoryToAdd.id,
    );

    if (existingCategory) {
      return prevCategories.filter(
        (categoryItem) => categoryItem.id !== categoryToAdd.id,
      );
    }
    return [...prevCategories, categoryToAdd];
  };
  const onFinishSelect = async () => {
    const preferences = selectedCategory.map((category) => category.name);
    const submitValue = { username: user ? user?.username : '', preferences };
    console.log(submitValue);
    if (selectedCategory.length >= 3) {
      try {
        const response = await setPreference({
          updateData: submitValue,
          username: `${user?.username}`,
        }).unwrap();
        dispatch(onSetCategories(response));
        navigate('/set-transaction-pin');
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const addNewCategory = (categoryToAdd) => {
    setSelectedCategory(addCategory(selectedCategory, categoryToAdd));
  };

  return (
    <>
      <Popup
        show={isSuccess || isError}
        variant={isSuccess ? 'success' : isError ? 'error' : undefined}
        message={
          isSuccess
            ? message || undefined
            : isError
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message
            : undefined
        }
      />
      <div className={styles.Categories}>
        <p className={styles.Info}>
          Choose 3 or more categories you would like to see live events in order
          of preference.
        </p>
        <div className={styles.CategoryItemsWrap}>
          {categories.map((categoryItem) => {
            const { imageUrl, id, name } = categoryItem;

            const selected: { id: number; name: string } =
              selectedCategory.find(
                (item: { id: number }) => item.id === categoryItem.id,
              ) || categoryItem;

            return (
              <div className={styles.Wrap} key={id}>
                {selected && selectedCategory.indexOf(selected) !== -1 ? (
                  <span className={styles.Tag}>
                    {' '}
                    {selectedCategory.indexOf(selected) + 1}{' '}
                  </span>
                ) : null}
                <img
                  style={{
                    outline: selectedCategory.find(
                      (item: { id: number }) => item.id === id,
                    )
                      ? '5px solid #24164C'
                      : 'none',
                  }}
                  onClick={() => addNewCategory({ id, name })}
                  src={imageUrl}
                  alt={`${name}`}
                />
              </div>
            );
          })}
        </div>
        <div className={styles.Button}>
          <Button
            buttonStyles={{ width: '100%' }}
            clicked={onFinishSelect}
            disabled={selectedCategory.length! < 3 || isLoading}
          >
            {`Done (${selectedCategory.length} selected)`}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Categories;
