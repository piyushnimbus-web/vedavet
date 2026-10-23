import { OperationsController, OpsDb } from "./operations";
import { FinanceInventoryController } from "./finance-inventory";
import { Module } from "@nestjs/common";
import { ApiController, Db } from "./routes";
import { ClinicalController } from "./clinical";
@Module({
  controllers: [
    ApiController,
    ClinicalController,
    FinanceInventoryController,
    OperationsController,
  ],
  providers: [Db, OpsDb],
})
export class AppModule {}
