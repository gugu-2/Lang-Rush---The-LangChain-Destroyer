from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from database import get_db
from models.dataset import Dataset, DatasetExample
from models.run import Run

router = APIRouter(prefix="/datasets", tags=["datasets"])

class DatasetCreate(BaseModel):
    project_id: str
    name: str
    description: str = ""

class ExampleCreate(BaseModel):
    inputs: str
    expected_output: str

class AddToDatasetRequest(BaseModel):
    dataset_id: str

@router.get("")
async def list_datasets(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dataset).where(Dataset.project_id == project_id))
    return result.scalars().all()

@router.post("")
async def create_dataset(req: DatasetCreate, db: AsyncSession = Depends(get_db)):
    ds = Dataset(project_id=req.project_id, name=req.name, description=req.description)
    db.add(ds)
    await db.commit()
    await db.refresh(ds)
    return ds

@router.get("/{id}")
async def get_dataset(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dataset).where(Dataset.id == id))
    ds = result.scalars().first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    ex_res = await db.execute(select(DatasetExample).where(DatasetExample.dataset_id == id))
    count = len(ex_res.scalars().all())
    return {"dataset": ds, "examples_count": count}

@router.get("/{id}/examples")
async def list_examples(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DatasetExample).where(DatasetExample.dataset_id == id))
    return result.scalars().all()

@router.post("/{id}/examples")
async def add_example(id: str, ex: ExampleCreate, db: AsyncSession = Depends(get_db)):
    new_ex = DatasetExample(dataset_id=id, inputs=ex.inputs, expected_output=ex.expected_output)
    db.add(new_ex)
    await db.commit()
    await db.refresh(new_ex)
    return new_ex

@router.delete("/{id}/examples/{example_id}")
async def delete_example(id: str, example_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DatasetExample).where(DatasetExample.id == example_id, DatasetExample.dataset_id == id))
    ex = result.scalars().first()
    if not ex:
        raise HTTPException(status_code=404, detail="Example not found")
    await db.delete(ex)
    await db.commit()
    return {"message": "Example deleted"}

# This one bridges with runs
@router.post("/runs/{run_id}/add-to-dataset")
async def add_run_to_dataset(run_id: str, req: AddToDatasetRequest, db: AsyncSession = Depends(get_db)):
    run_res = await db.execute(select(Run).where(Run.id == run_id))
    run = run_res.scalars().first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    new_ex = DatasetExample(
        dataset_id=req.dataset_id,
        inputs=run.inputs,
        expected_output=run.outputs
    )
    db.add(new_ex)
    await db.commit()
    await db.refresh(new_ex)
    return new_ex
