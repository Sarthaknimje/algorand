from pyteal import *

def approval_program():
    # Global state keys
    token_owner = Bytes("token_owner")
    recovery_address = Bytes("recovery_address")
    token_balance = Bytes("token_balance")
    is_locked = Bytes("is_locked")
    recovery_threshold = Bytes("recovery_threshold")
    recovery_approvals = Bytes("recovery_approvals")

    # Operations
    setup = Bytes("setup")
    transfer = Bytes("transfer")
    initiate_recovery = Bytes("initiate_recovery")
    approve_recovery = Bytes("approve_recovery")
    complete_recovery = Bytes("complete_recovery")
    lock = Bytes("lock")
    unlock = Bytes("unlock")

    # Setup operation
    setup_contract = Seq([
        Assert(Txn.application_args[1] != Bytes("")),  # Check if owner address is provided
        App.globalPut(token_owner, Txn.application_args[1]),
        App.globalPut(recovery_address, Txn.application_args[2]),
        App.globalPut(token_balance, Int(0)),
        App.globalPut(is_locked, Int(0)),
        App.globalPut(recovery_threshold, Int(3)),  # Require 3 approvals for recovery
        App.globalPut(recovery_approvals, Int(0)),
        Return(Int(1))
    ])

    # Transfer operation
    transfer_tokens = Seq([
        Assert(App.globalGet(is_locked) == Int(0)),  # Check if contract is not locked
        Assert(Txn.sender() == App.globalGet(token_owner)),  # Only owner can transfer
        Assert(Btoi(Txn.application_args[2]) > Int(0)),  # Amount must be positive
        App.globalPut(token_balance, App.globalGet(token_balance) - Btoi(Txn.application_args[2])),
        Return(Int(1))
    ])

    # Initiate recovery operation
    start_recovery = Seq([
        Assert(Txn.sender() == App.globalGet(recovery_address)),  # Only recovery address can initiate
        Assert(App.globalGet(is_locked) == Int(0)),  # Contract must not be locked
        App.globalPut(is_locked, Int(1)),
        App.globalPut(recovery_approvals, Int(0)),
        Return(Int(1))
    ])

    # Approve recovery operation
    approve_recovery_process = Seq([
        Assert(App.globalGet(is_locked) == Int(1)),  # Contract must be locked
        Assert(App.globalGet(recovery_approvals) < App.globalGet(recovery_threshold)),  # Check threshold
        App.globalPut(recovery_approvals, App.globalGet(recovery_approvals) + Int(1)),
        Return(Int(1))
    ])

    # Complete recovery operation
    finish_recovery = Seq([
        Assert(App.globalGet(is_locked) == Int(1)),  # Contract must be locked
        Assert(App.globalGet(recovery_approvals) >= App.globalGet(recovery_threshold)),  # Check approvals
        Assert(Txn.sender() == App.globalGet(recovery_address)),  # Only recovery address can complete
        App.globalPut(token_owner, Txn.application_args[2]),  # Set new owner
        App.globalPut(is_locked, Int(0)),  # Unlock contract
        App.globalPut(recovery_approvals, Int(0)),  # Reset approvals
        Return(Int(1))
    ])

    # Lock operation
    lock_contract = Seq([
        Assert(Txn.sender() == App.globalGet(token_owner)),  # Only owner can lock
        App.globalPut(is_locked, Int(1)),
        Return(Int(1))
    ])

    # Unlock operation
    unlock_contract = Seq([
        Assert(Txn.sender() == App.globalGet(token_owner)),  # Only owner can unlock
        App.globalPut(is_locked, Int(0)),
        Return(Int(1))
    ])

    # Main program
    program = Cond(
        [Txn.application_id() == Int(0), setup_contract],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(Int(0))],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(Int(0))],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],
        [Txn.application_args[0] == transfer, transfer_tokens],
        [Txn.application_args[0] == initiate_recovery, start_recovery],
        [Txn.application_args[0] == approve_recovery, approve_recovery_process],
        [Txn.application_args[0] == complete_recovery, finish_recovery],
        [Txn.application_args[0] == lock, lock_contract],
        [Txn.application_args[0] == unlock, unlock_contract]
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    with open("token_recovery_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
        f.write(compiled)

    with open("token_recovery_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
        f.write(compiled) 