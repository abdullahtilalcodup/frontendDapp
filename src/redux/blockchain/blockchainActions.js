// constants
import Web3 from "web3";
import SmartContract from "../../contracts/SmartContract.json";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        // const NetworkData = await SmartContract.networks[networkId];
        if (networkId==4) {
          const SmartContractObj = new web3.eth.Contract(
            SmartContract.abi,
            // "0x39FE8FB1c938626d26F672E8837cEa35d5E911E0"
            // "0xB32FcC372bf44F474808cD04902A59Cd7BEE8C7A"
            // "0x6B4250DF5fAdBB2F34855963F8c2F57fe38fd624"
            // "0x88b89cE2DEe5Be4DaFa13e6484fa6972715460bE"
            "0xdfA367a03aBa7DE269eDe7C85De6684d204074fD"
            // NetworkData.address
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Eth."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
