import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    // o constructor já instancia nessa variável
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestTransaction): Transaction {
    // Se o type não inclui qualquer um desses valores income ou outcome
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transactions type is invalid');
    }

    const { total } = this.transactionsRepository.getBalance();

    // Saque maior que o saldo atual
    if (type === 'outcome' && total < value) {
      throw new Error('You do not have enough balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
