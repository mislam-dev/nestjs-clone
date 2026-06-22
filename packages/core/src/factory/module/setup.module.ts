/*

1. controller 
2. provider 
3. import module

*/
export type TModule = {
  controllers?: any[];
  providers?: any[];
  imports?: TModule[];
};
