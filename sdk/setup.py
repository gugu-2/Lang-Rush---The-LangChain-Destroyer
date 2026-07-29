from setuptools import setup, find_packages

setup(
    name='langforge-sdk',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'requests>=2.31.0',
        'pydantic>=2.0.0',
    ],
    extras_require={
        'langchain': ['langchain-core>=0.2.0'],
    },
    entry_points={
        'console_scripts': [
            'langforge=langforge.cli:main',
        ],
    },
    python_requires='>=3.9',
    description='Official SDK for LangForge — All-in-one LLMOps Platform',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
)
