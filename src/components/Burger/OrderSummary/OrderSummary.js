import React, { Component } from 'react';
import Aux from '../../../hoc/Auxi/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  componentDidUpdate() {
    console.log('[OrderSummar] Will Update');
  }

  render() {
    const ingredientSummary = Object.keys(this.props.ingredients)
      .map(igKey => {
        return (
          <li key={igKey}>
            <span className="text-capitalize">{igKey}</span>: {this.props.ingredients[igKey]}
          </li>)
      });

    return (
      <Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p className="text-danger font-weight-bold h4">Total Price: {this.props.price}</p>
        <p>Continue to checkout?</p>
        <Button
          btnType="Danger"
          clicked={this.props.purchaseCancelled}>CANCEL</Button>
        <Button
          btnType="Success"
          clicked={this.props.purchaseContinued} >CONTINUE</Button>
      </Aux>
    )
  }
}

export default OrderSummary;