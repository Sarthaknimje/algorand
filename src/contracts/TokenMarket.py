from pyteal import *

def approval_program():
    # Global state keys
    token_id_key = Bytes("token_id")
    price_key = Bytes("price")
    creator_key = Bytes("creator")
    platform_fee_key = Bytes("platform_fee")
    creator_royalty_key = Bytes("creator_royalty")
    trading_fee_key = Bytes("trading_fee")
    total_volume_key = Bytes("total_volume")
    last_price_key = Bytes("last_price")

    # Operations
    setup = Bytes("setup")
    buy = Bytes("buy")
    sell = Bytes("sell")
    update_price = Bytes("update_price")

    # Helper functions
    def get_token_id():
        return App.globalGet(token_id_key)

    def get_price():
        return App.globalGet(price_key)

    def get_creator():
        return App.globalGet(creator_key)

    def get_platform_fee():
        return App.globalGet(platform_fee_key)

    def get_creator_royalty():
        return App.globalGet(creator_royalty_key)

    def get_trading_fee():
        return App.globalGet(trading_fee_key)

    def get_total_volume():
        return App.globalGet(total_volume_key)

    def get_last_price():
        return App.globalGet(last_price_key)

    def calculate_fee(amount, fee_rate):
        return MulDiv(amount, fee_rate, Int(1000000))

    # Setup operation
    setup_operation = Seq([
        Assert(Txn.application_args[1] != Bytes("")),  # Token ID
        Assert(Txn.application_args[2] != Bytes("")),  # Creator address
        App.globalPut(token_id_key, Btoi(Txn.application_args[1])),
        App.globalPut(price_key, Int(1000000)),  # Initial price: 1 ALGO
        App.globalPut(creator_key, Txn.application_args[2]),
        App.globalPut(platform_fee_key, Int(50000)),  # 5% platform fee
        App.globalPut(creator_royalty_key, Int(50000)),  # 5% creator royalty
        App.globalPut(trading_fee_key, Int(1000)),  # 0.1% trading fee
        App.globalPut(total_volume_key, Int(0)),
        App.globalPut(last_price_key, Int(1000000)),
        Return(Int(1))
    ])

    # Buy operation
    buy_operation = Seq([
        Assert(Txn.accounts[1] == get_creator()),  # Creator address
        Assert(Gtxn[0].type_enum() == TxnType.Payment),  # Payment transaction
        Assert(Gtxn[0].receiver() == Global.current_application_address()),
        
        # Calculate fees
        platform_fee = calculate_fee(Gtxn[0].amount(), get_platform_fee()),
        creator_royalty = calculate_fee(Gtxn[0].amount(), get_creator_royalty()),
        trading_fee = calculate_fee(Gtxn[0].amount(), get_trading_fee()),
        
        # Calculate token amount
        total_fees = platform_fee + creator_royalty + trading_fee,
        token_amount = MulDiv(Gtxn[0].amount() - total_fees, Int(1000000), get_price()),
        
        # Update state
        App.globalPut(total_volume_key, get_total_volume() + Gtxn[0].amount()),
        App.globalPut(last_price_key, get_price()),
        
        # Transfer tokens to buyer
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: token_amount,
            TxnField.xfer_asset: get_token_id()
        }),
        InnerTxnBuilder.Submit(),
        
        # Transfer fees to creator
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: get_creator(),
            TxnField.amount: creator_royalty
        }),
        InnerTxnBuilder.Submit(),
        
        Return(Int(1))
    ])

    # Sell operation
    sell_operation = Seq([
        Assert(Txn.accounts[1] == get_creator()),  # Creator address
        Assert(Gtxn[0].type_enum() == TxnType.AssetTransfer),  # Asset transfer transaction
        Assert(Gtxn[0].asset_receiver() == Global.current_application_address()),
        Assert(Gtxn[0].xfer_asset() == get_token_id()),
        
        # Calculate fees
        token_value = MulDiv(Gtxn[0].asset_amount(), get_price(), Int(1000000)),
        platform_fee = calculate_fee(token_value, get_platform_fee()),
        creator_royalty = calculate_fee(token_value, get_creator_royalty()),
        trading_fee = calculate_fee(token_value, get_trading_fee()),
        
        # Calculate ALGO amount
        total_fees = platform_fee + creator_royalty + trading_fee,
        algo_amount = token_value - total_fees,
        
        # Update state
        App.globalPut(total_volume_key, get_total_volume() + token_value),
        App.globalPut(last_price_key, get_price()),
        
        # Transfer ALGO to seller
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: Txn.sender(),
            TxnField.amount: algo_amount
        }),
        InnerTxnBuilder.Submit(),
        
        # Transfer fees to creator
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: get_creator(),
            TxnField.amount: creator_royalty
        }),
        InnerTxnBuilder.Submit(),
        
        Return(Int(1))
    ])

    # Update price operation
    update_price_operation = Seq([
        Assert(Txn.sender() == get_creator()),  # Only creator can update price
        Assert(Txn.application_args[1] != Bytes("")),  # New price
        new_price = Btoi(Txn.application_args[1]),
        Assert(new_price > Int(0)),  # Price must be positive
        App.globalPut(price_key, new_price),
        Return(Int(1))
    ])

    # Main program
    program = Cond(
        [Txn.application_id() == Int(0), setup_operation],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(Int(0))],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(Int(0))],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],
        [Txn.application_args[0] == setup, setup_operation],
        [Txn.application_args[0] == buy, buy_operation],
        [Txn.application_args[0] == sell, sell_operation],
        [Txn.application_args[0] == update_price, update_price_operation]
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    with open("token_market_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
        f.write(compiled)

    with open("token_market_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
        f.write(compiled) 