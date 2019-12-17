import React, { Component } from 'react';
import Aux from '../../hoc/Auxi/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchashing: false,
    loading: false,
    error: false,
  }

  componentDidMount() {
    axios
      .get('https://react-my-burger-a2cf7.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchaseable: sum > 0 })
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCounted = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCounted;
    const priceAddition = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCounted = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCounted;
    const priceDeduction = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({ purchashing: true })
  }

  purchaseCancelHandler = () => {
    this.setState({ purchashing: false });
  }

  purchaseContinueHandler = () => {
    // alert('You continue!');
    // this.setState({ loading: true })
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customerData: {
    //     name: 'Bagas Ranggen',
    //     address: {
    //       street: 'Lorem',
    //       zipCode: '123441',
    //       country: 'Indonesia',
    //     },
    //     email: 'mail@mail.com',
    //   },
    //   deliveryMethod: 'fastest',
    // };

    // axios
    //   .post('/orders', order)
    //   .then(response => {
    //     console.log(response);
    //     this.setState({ loading: false, purchashing: false })
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.setState({ loading: false, purchashing: false })
    //   });
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients cannot be loaded</p> : <Spinner />;

    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchaseable={this.state.purchaseable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice} />
        </Aux>
      );

      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice.toFixed(2)}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchashing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
};

export default withErrorHandler(BurgerBuilder, axios);