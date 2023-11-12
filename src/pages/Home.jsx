import React from "react";
import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Category from "../components/Category";
import { setCategoryId, setCurrentPage } from "../redux/slices/filterSlice";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PIzzaBlock/PizzaBlock";
import Skeleton from "../components/PIzzaBlock/Skeleton";
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";

const Home = () => {
  const categoryId = useSelector((state) => state.filter.categoryId);
  const sortType = useSelector((state) => state.filter.sort.sortProperty);
  const currentPage = useSelector((state) => state.filter.currentPage);
  const dispatch = useDispatch();

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const [currentPage, setCurrentPage] = useState(1);

  const onChangeCategory = (id) => {
    console.log(id);
    dispatch(setCategoryId(id));
  };
  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  useEffect(() => {
    setIsLoading(true);
    const sortBy = sortType?.replace("-", "");
    const order = sortType?.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=&{categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    axios
      .get(
        `https://632d38db0d7928c7d246d6e6.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      )
      .then((res) => {
        setItems(res.data);

        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));
  const pizzas = items.map((object) => (
    <PizzaBlock key={object.id} {...object} />
  ));
  return (
    <div className="container">
      <div className="content__top">
        <Category value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
