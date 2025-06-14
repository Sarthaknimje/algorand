from pyteal import *

def approval_program():
    # Operations
    MINT = Bytes("mint")
    BURN = Bytes("burn")

    # State keys
    TOTAL_SUPPLY = Bytes("total_supply")
    CREATOR = Bytes("creator")
    ASSET_ID = Bytes("asset_id")

    # Helper functions
    def get_total_supply():
        return App.globalGet(TOTAL_SUPPLY)

    def get_creator():
        return App.globalGet(CREATOR)

    def get_asset_id():
        return App.globalGet(ASSET_ID)

    def update_total_supply(amount):
        return App.globalPut(TOTAL_SUPPLY, get_total_supply() + amount)

    # Mint operation
    def mint_tokens():
        amount = Btoi(Txn.application_args[1])
        
        return Seq([
            Assert(Txn.sender() == get_creator()),
            update_total_supply(amount),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: Txn.sender(),
                TxnField.asset_amount: amount,
                TxnField.xfer_asset: get_asset_id(),
            }),
            InnerTxnBuilder.Submit(),
            Return(Int(1))
        ])

    # Burn operation
    def burn_tokens():
        amount = Btoi(Txn.application_args[1])
        
        return Seq([
            Assert(Txn.sender() == get_creator()),
            Assert(get_total_supply() >= amount),
            update_total_supply(Int(0) - amount),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: Global.zero_address(),
                TxnField.asset_amount: amount,
                TxnField.xfer_asset: get_asset_id(),
            }),
            InnerTxnBuilder.Submit(),
            Return(Int(1))
        ])

    # Program
    program = Cond(
        [Txn.application_id() == Int(0), Return(Int(1))],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(Int(0))],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(Int(0))],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],
        [Txn.application_args[0] == MINT, mint_tokens()],
        [Txn.application_args[0] == BURN, burn_tokens()],
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    with open("src/contracts/token_mint_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
        f.write(compiled)

    with open("src/contracts/token_mint_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
        f.write(compiled) 