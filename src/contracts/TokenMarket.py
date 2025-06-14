from pyteal import *

def approval_program():
    # Constants
    TOKEN_PRICE = Int(1000000)  # 1 ALGO in microAlgos
    MIN_AMOUNT = Int(100000)    # 0.1 ALGO minimum

    # Operations
    BUY = Bytes("buy")
    SELL = Bytes("sell")

    # State keys
    TOKEN_BALANCE = Bytes("token_balance")
    ALGO_BALANCE = Bytes("algo_balance")
    ASSET_ID = Bytes("asset_id")

    # Helper functions
    def get_token_balance():
        return App.globalGet(TOKEN_BALANCE)

    def get_algo_balance():
        return App.globalGet(ALGO_BALANCE)

    def get_asset_id():
        return App.globalGet(ASSET_ID)

    def update_token_balance(amount):
        return App.globalPut(TOKEN_BALANCE, get_token_balance() + amount)

    def update_algo_balance(amount):
        return App.globalPut(ALGO_BALANCE, get_algo_balance() + amount)

    # Buy tokens operation
    def buy_tokens():
        amount = Btoi(Txn.application_args[1])
        return Seq([
            Assert(Txn.type_enum() == TxnType.Payment),
            Assert(Txn.amount() == amount * TOKEN_PRICE),
            Assert(Txn.receiver() == Global.current_application_address()),
            Assert(amount >= MIN_AMOUNT),
            update_token_balance(amount),
            update_algo_balance(Txn.amount()),
            Return(Int(1))
        ])

    # Sell tokens operation
    def sell_tokens():
        amount = Btoi(Txn.application_args[1])
        return Seq([
            Assert(amount <= get_token_balance()),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: Txn.sender(),
                TxnField.asset_amount: amount,
                TxnField.xfer_asset: get_asset_id(),
            }),
            InnerTxnBuilder.Submit(),
            update_token_balance(Int(0) - amount),
            update_algo_balance(Int(0) - (amount * TOKEN_PRICE)),
            Return(Int(1))
        ])

    # Main program logic
    program = Cond(
        [Txn.application_id() == Int(0), Return(Int(1))],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(Int(1))],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(Int(1))],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],
        [Txn.application_args[0] == BUY, buy_tokens()],
        [Txn.application_args[0] == SELL, sell_tokens()],
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    with open("src/contracts/token_market_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
        f.write(compiled)

    with open("src/contracts/token_market_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
        f.write(compiled) 