import { useState, useCallback, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import { useToast } from './use-toast';
import { USDC_DEVNET_MINT } from '@/lib/configAddress';

interface PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
}

interface PaymentParams {
  recipient: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  memo?: string;
}

export const useSolanaPayment = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const usdcMint = useMemo(() => new PublicKey(USDC_DEVNET_MINT), []);

  /**
   * Pay with SOL
   */
  const payWithSol = useCallback(async (
    recipient: string,
    amountSol: number
  ): Promise<PaymentResult> => {
    if (!publicKey || !signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsProcessing(true);

    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      toast({
        title: 'Payment successful',
        description: `Sent ${amountSol} SOL`,
      });

      return { success: true, signature };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast({
        title: 'Payment failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, signTransaction, sendTransaction, connection, toast]);

  /**
   * Pay with USDC (SPL Token)
   */
  const payWithUsdc = useCallback(async (
    recipient: string,
    amountUsdc: number
  ): Promise<PaymentResult> => {
    if (!publicKey || !signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsProcessing(true);

    try {
      const recipientPubkey = new PublicKey(recipient);
      // USDC has 6 decimals
      const amount = Math.floor(amountUsdc * 1_000_000);

      const senderAta = getAssociatedTokenAddressSync(usdcMint, publicKey);
      const recipientAta = getAssociatedTokenAddressSync(usdcMint, recipientPubkey);

      const transaction = new Transaction();

      // Check if recipient has ATA, if not create it
      try {
        await getAccount(connection, recipientAta);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientAta,
            recipientPubkey,
            usdcMint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderAta,
          recipientAta,
          publicKey,
          amount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      toast({
        title: 'Payment successful',
        description: `Sent ${amountUsdc} USDC`,
      });

      return { success: true, signature };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast({
        title: 'Payment failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, signTransaction, sendTransaction, connection, usdcMint, toast]);

  /**
   * Generic payment method
   */
  const pay = useCallback(async (params: PaymentParams): Promise<PaymentResult> => {
    if (params.currency === 'SOL') {
      return payWithSol(params.recipient, params.amount);
    } else {
      return payWithUsdc(params.recipient, params.amount);
    }
  }, [payWithSol, payWithUsdc]);

  /**
   * Get SOL balance
   */
  const getSolBalance = useCallback(async (): Promise<number> => {
    if (!publicKey) return 0;
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch {
      return 0;
    }
  }, [publicKey, connection]);

  /**
   * Get USDC balance
   */
  const getUsdcBalance = useCallback(async (): Promise<number> => {
    if (!publicKey) return 0;
    try {
      const ata = getAssociatedTokenAddressSync(usdcMint, publicKey);
      const account = await getAccount(connection, ata);
      return Number(account.amount) / 1_000_000;
    } catch {
      return 0;
    }
  }, [publicKey, connection, usdcMint]);

  return {
    pay,
    payWithSol,
    payWithUsdc,
    getSolBalance,
    getUsdcBalance,
    isProcessing,
    isConnected: !!publicKey,
    walletAddress: publicKey?.toBase58(),
  };
};

export default useSolanaPayment;
